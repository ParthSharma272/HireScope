# backend/core/keyword_match.py
import re
import logging
from collections import Counter
import numpy as np
from typing import List, Dict, Set, Optional
from utils.cache import cached, get_cache_stats

logger = logging.getLogger(__name__)

# Singleton pattern for lazy model loading with better error handling
_model = None
_model_loading = False

def get_embedding_model() -> Optional[object]:
    """
    Lazy load embedding model with singleton pattern and error handling.
    Returns None if model fails to load (allows graceful degradation).
    """
    global _model, _model_loading
    
    if _model is not None:
        return _model
    
    if _model_loading:
        logger.warning("Model already loading, waiting...")
        return None
    
    try:
        _model_loading = True
        logger.info("🔄 Loading embedding model (all-mpnet-base-v2)...")
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as imp_err:
            logger.error(
                "sentence_transformers import failed during get_embedding_model. Ensure 'sentence-transformers' and its native deps (torch) are installed."
            )
            return None

        _model = SentenceTransformer('all-mpnet-base-v2')
        logger.info("✅ Embedding model loaded successfully")
        return _model
    except Exception as e:
        logger.error(f"❌ Failed to load embedding model: {e}")
        return None
    finally:
        _model_loading = False

# Enhanced stopwords list
STOPWORDS = set()
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    STOPWORDS = set([w.text.lower() for w in nlp.Defaults.stop_words])
except Exception:
    # fallback minimal stopwords
    STOPWORDS = {"and","or","the","a","an","to","in","for","on","with"}

# Additional common non-keywords to filter out
COMMON_WORDS = {
    # Articles, prepositions, conjunctions
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", 
    "of", "with", "by", "from", "up", "about", "into", "through", "during",
    # Pronouns
    "it", "its", "this", "that", "these", "those", "they", "their", "our",
    "your", "we", "us", "you", "he", "she", "him", "her",
    # Verbs (common, non-skill related)
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "should", "could", "may", "might",
    "can", "must", "shall",
    # Common adjectives/adverbs (non-technical)
    "all", "some", "any", "many", "much", "more", "most", "less", "other",
    "such", "own", "same", "so", "than", "too", "very", "just", "where",
    "when", "how", "what", "who", "which", "there", "here", "then", "now",
    # Common job posting words (non-skills)
    "role", "position", "candidate", "candidates", "job", "work", "working",
    "team", "teams", "company", "business", "organization", "department",
    "responsibilities", "requirements", "qualifications", "preferred",
    "required", "looking", "seeking", "hiring", "join", "help", "support",
    "across", "within", "between", "among", "including", "based", "related",
    # Common connector words
    "also", "both", "each", "either", "every", "neither", "nor", "not",
    "only", "both", "whether", "as", "if", "because", "since", "while",
    # Size/quantity (non-technical)
    "one", "two", "three", "four", "five", "years", "year", "months", "days",
    "large", "small", "big", "new", "old", "high", "low", "good", "best",
    "strong", "able", "well", "able",
    # Generic job terms
    "type", "types", "title", "titles", "experience", "skilled", "skills",
    "skill", "knowledge", "ability", "understanding", "familiarity",
    "engineer", "engineers", "engineering", "developer", "developers",
    "specialist", "manager", "lead", "senior", "junior", "intern",
    # Location-related words (usually not skills)
    "location", "remote", "onsite", "hybrid", "office", "site",
    "india", "delhi", "bangalore", "mumbai", "pune", "hyderabad",
    "usa", "california", "texas", "new", "york", "francisco",
    # Time-related
    "time", "full", "part", "contract", "permanent", "temporary",
    # Problem/solution generic terms
    "problem", "problems", "solution", "solutions", "issue", "issues",
    # Communication verbs (too generic)
    "communicate", "communicating", "communication", "collaborate",
    "collaborating", "collaboration", "working", "manage", "managing",
    # Database/monitoring generic terms (keep specific tools, not generic terms)
    "database", "databases", "monitoring", "deployment", "design",
    # Enjoyment/personal terms
    "enjoy", "like", "love", "passion", "passionate", "excited",
    # Measurement terms (too generic)
    "measurable", "measure", "metrics", "kpi", "kpis",
    # Generic tech terms (keep specific ones like Python, Docker)
    "technology", "technologies", "tool", "tools", "system", "systems",
    "platform", "platforms", "software", "application", "applications",
    "service", "services", "product", "products",
    # Resume filler words
    "responsible", "responsibilities", "duties", "tasks", "activities",
    "include", "includes", "including", "such", "various", "multiple",
    "several", "different", "relevant", "appropriate", "necessary",
    # Action verbs (too generic to be keywords)
    "using", "used", "use", "build", "built", "create", "created",
    "develop", "developed", "implement", "implemented", "maintain",
    "write", "writing", "read", "reading", "analyze", "analyzed"
}

# Merge with spaCy stopwords
ALL_STOPWORDS = STOPWORDS.union(COMMON_WORDS)

# Technical keywords patterns that should be kept even if they're short
TECHNICAL_PATTERNS = {
    'ai', 'ml', 'ci', 'cd', 'ui', 'ux', 'api', 'aws', 'gcp', 'sql', 'nlp',
    'rnn', 'cnn', 'gpu', 'cpu', 'ide', 'cli', 'etl', 'iot', 'sla', 'sdk',
    'c++', 'c#', 'r', 'go', 'ios', 'npm', 'git', 'ssh', 'tcp', 'udp', 'http',
    'rest', 'soap', 'json', 'xml', 'yaml', 'html', 'css', 'sqs', 'sns', 'ecs',
    'eks', 'rds', 'ec2', 's3', 'vpc', 'iam', 'arm', 'x86', 'llm', 'rag', 'ocr'
}

# Specific technical terms to keep (common technologies, frameworks, tools)
KEEP_TECH_TERMS = {
    'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
    'node', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring',
    'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'terraform',
    'ansible', 'postgres', 'postgresql', 'mysql', 'mongodb', 'redis',
    'elasticsearch', 'kafka', 'rabbitmq', 'spark', 'hadoop', 'airflow',
    'pytorch', 'tensorflow', 'keras', 'scikit', 'pandas', 'numpy',
    'linux', 'unix', 'windows', 'macos', 'ubuntu', 'debian', 'centos',
    'azure', 'gcp', 'heroku', 'vercel', 'netlify', 'digitalocean',
    'graphql', 'grpc', 'websocket', 'oauth', 'jwt', 'saml',
    'microservices', 'serverless', 'devops', 'mlops', 'cicd',
    'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'tableau', 'powerbi', 'looker', 'grafana', 'prometheus',
    'nginx', 'apache', 'tomcat', 'gunicorn', 'uvicorn',
    'pytest', 'junit', 'selenium', 'cypress', 'jest',
    'vscode', 'pycharm', 'intellij', 'eclipse', 'vim',
    'bash', 'shell', 'powershell', 'cmd',
    'frontend', 'backend', 'fullstack', 'mobile', 'web',
    'android', 'kotlin', 'swift', 'flutter', 'reactnative'
}

def is_likely_technical(token: str) -> bool:
    """Determine if a token is likely a technical keyword"""
    # Check if it's in our known tech terms
    if token in KEEP_TECH_TERMS or token in TECHNICAL_PATTERNS:
        return True
    
    # Check for version numbers (e.g., python3, java11)
    if any(char.isdigit() for char in token) and any(char.isalpha() for char in token):
        return True
    
    # Check for special characters common in tech (but not just dots)
    if any(c in token for c in ['+', '#', '-']) and not token.replace('.', '').replace('-', '').isalpha():
        return True
    
    # Check for camelCase or PascalCase (common in programming)
    if len(token) > 4 and token[0].islower() and any(c.isupper() for c in token[1:]):
        return True
    
    # Check for common tech suffixes
    tech_suffixes = ['js', 'py', 'sql', 'db', 'api', 'sdk', 'cli', 'ops']
    if any(token.endswith(suffix) for suffix in tech_suffixes):
        return True
    
    return False

# Reference technical skills database (known technologies, frameworks, tools)
TECHNICAL_KEYWORDS = {
    # Programming Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl',
    
    # Web Frameworks
    'react', 'angular', 'vue', 'svelte', 'nextjs', 'nuxt', 'gatsby',
    'django', 'flask', 'fastapi', 'spring', 'express', 'nestjs',
    'rails', 'laravel', 'aspnet', 'blazor',
    
    # Mobile Development
    'android', 'ios', 'flutter', 'react-native', 'xamarin', 'ionic',
    
    # Databases
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'cassandra', 'dynamodb', 'neo4j', 'oracle', 'sqlserver',
    'sqlite', 'mariadb', 'couchdb', 'influxdb',
    
    # Cloud Platforms
    'aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'vercel',
    'netlify', 'cloudflare', 'linode', 'vultr',
    
    # DevOps & Tools
    'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
    'terraform', 'ansible', 'chef', 'puppet', 'vagrant',
    'circleci', 'travis', 'bamboo', 'teamcity',
    
    # Data & ML
    'pytorch', 'tensorflow', 'keras', 'scikit-learn', 'pandas',
    'numpy', 'scipy', 'spark', 'hadoop', 'airflow', 'kafka',
    'flink', 'storm', 'databricks', 'mlflow', 'kubeflow',
    
    # Testing
    'pytest', 'junit', 'testng', 'selenium', 'cypress',
    'jest', 'mocha', 'jasmine', 'cucumber', 'postman',
    
    # Monitoring & Logging
    'grafana', 'prometheus', 'datadog', 'newrelic', 'splunk',
    'elk', 'kibana', 'logstash', 'sentry', 'pagerduty',
    
    # Message Queues
    'rabbitmq', 'activemq', 'zeromq', 'nats', 'pulsar',
    
    # Web Servers
    'nginx', 'apache', 'tomcat', 'gunicorn', 'uvicorn', 'iis',
    
    # Version Control
    'git', 'svn', 'mercurial', 'perforce',
    
    # API Technologies
    'rest', 'graphql', 'grpc', 'soap', 'websocket',
    
    # Auth & Security
    'oauth', 'jwt', 'saml', 'ldap', 'ssl', 'tls',
    
    # OS & Platforms
    'linux', 'unix', 'windows', 'macos', 'ubuntu', 'debian',
    'centos', 'redhat', 'fedora', 'alpine',
    
    # Methodologies
    'agile', 'scrum', 'kanban', 'devops', 'mlops', 'cicd',
    
    # IDEs & Editors
    'vscode', 'pycharm', 'intellij', 'eclipse', 'vim',
    'emacs', 'sublime', 'atom', 'webstorm',
    
    # Concepts
    'microservices', 'serverless', 'containerization', 'orchestration',
    'frontend', 'backend', 'fullstack', 'api', 'sdk', 'cli',
    
    # Short forms
    'ai', 'ml', 'nlp', 'cv', 'ci', 'cd', 'ui', 'ux',
    'sql', 'nosql', 'html', 'css', 'json', 'xml', 'yaml',
    'http', 'https', 'tcp', 'udp', 'ssh', 'ftp',
    'aws-ec2', 's3', 'lambda', 'rds', 'vpc', 'iam', 'eks', 'ecs',
    'etl', 'iot', 'rnn', 'cnn', 'gpu', 'cpu', 'ram',
}

# Common compound technical terms (2-3 words max)
COMPOUND_TERMS = {
    'machine learning', 'deep learning', 'data science', 'web development',
    'mobile development', 'cloud computing', 'data engineering',
    'software engineering', 'full stack', 'front end', 'back end',
    'natural language processing', 'computer vision', 'data analysis',
    'business intelligence', 'version control', 'continuous integration',
    'continuous deployment', 'test driven development', 'object oriented',
    'functional programming', 'responsive design', 'api development',
    'database design', 'system design', 'code review', 'unit testing',
    'integration testing', 'performance optimization', 'load balancing',
    'message queue', 'service mesh', 'infrastructure as code',
    'configuration management', 'container orchestration',
}

def extract_candidate_phrases(text: str) -> List[str]:
    """Extract clean technical keywords and short compound terms"""
    candidates = []
    text_lower = text.lower()
    
    # 1. Extract known compound terms first (2-3 words)
    for compound in COMPOUND_TERMS:
        if compound in text_lower:
            candidates.append(compound)
    
    # 2. Extract individual technical keywords
    tokens = re.findall(r'\b[a-zA-Z0-9\+\-\#\.]{2,}\b', text_lower)
    for token in tokens:
        # Skip stopwords
        if token in ALL_STOPWORDS or token.isdigit():
            continue
        
        # Keep if it's a known technical keyword
        if token in TECHNICAL_KEYWORDS:
            candidates.append(token)
            continue
        
        # Keep technical patterns (AI, ML, etc.)
        if token in TECHNICAL_PATTERNS:
            candidates.append(token)
            continue
        
        # Keep if has special tech characters
        if any(c in token for c in ['+', '#', '-']) and len(token) >= 2:
            candidates.append(token)
            continue
        
        # Keep camelCase or version numbers (python3, java11)
        if (any(char.isdigit() for char in token) and any(char.isalpha() for char in token)) or \
           (len(token) > 4 and token[0].islower() and any(c.isupper() for c in token[1:])):
            candidates.append(token)
    
    # 3. Extract selective bigrams (only if both words are tech-related)
    words = [w for w in tokens if w not in ALL_STOPWORDS and not w.isdigit()]
    for i in range(len(words)-1):
        bigram = f"{words[i]} {words[i+1]}"
        # Only keep if not already in compound terms and both words look technical
        if bigram not in COMPOUND_TERMS and \
           (words[i] in TECHNICAL_KEYWORDS or words[i] in TECHNICAL_PATTERNS) and \
           (words[i+1] in TECHNICAL_KEYWORDS or words[i+1] in TECHNICAL_PATTERNS):
            candidates.append(bigram)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_candidates = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            unique_candidates.append(c)
    
    return unique_candidates

@cached(prefix="jd_keywords", ttl=3600)  # Cache for 1 hour
def simple_keywords_from_jd(jd_text: str) -> list:
    """
    Extract clean technical keywords (not long phrases).
    Results are cached for better performance on repeated JDs.
    """
    logger.debug(f"Extracting keywords from JD (length: {len(jd_text)} chars)")
    
    # Extract candidates (clean technical keywords and short compounds)
    candidates = extract_candidate_phrases(jd_text)
    
    if not candidates:
        logger.warning("No candidate phrases extracted from JD")
        return []
    
    # Use semantic filtering only for ambiguous terms
    model = get_embedding_model()
    
    # Separate known technical terms from ambiguous ones
    known_technical = []
    ambiguous = []
    
    for candidate in candidates:
        # Directly accept known technical keywords and compound terms
        if candidate in TECHNICAL_KEYWORDS or candidate in COMPOUND_TERMS or candidate in TECHNICAL_PATTERNS:
            known_technical.append(candidate)
        # Accept short technical-looking terms
        elif any(c in candidate for c in ['+', '#', '-', '.']) or \
             (any(char.isdigit() for char in candidate) and any(char.isalpha() for char in candidate)):
            known_technical.append(candidate)
        # For ambiguous single words, use semantic filtering
        elif ' ' not in candidate and len(candidate) >= 3:
            ambiguous.append(candidate)
        # For 2-word phrases, check if both words are meaningful
        elif ' ' in candidate:
            words = candidate.split()
            if len(words) == 2 and all(len(w) >= 3 for w in words):
                ambiguous.append(candidate)
    
    # Semantic filtering for ambiguous terms (only if model loaded)
    if ambiguous and model is not None:
        try:
            # Use more specific technical anchors
            tech_anchors = [
                "python java programming", "docker kubernetes cloud",
                "react angular vue framework", "postgresql mysql database",
                "tensorflow pytorch machine learning", "aws azure gcp platform",
                "git jenkins devops", "api rest graphql", "agile scrum methodology"
            ]
            
            anchor_embeddings = model.encode(tech_anchors, convert_to_numpy=True)
            ambiguous_embeddings = model.encode(ambiguous, convert_to_numpy=True)
            
            for idx, candidate in enumerate(ambiguous):
                candidate_emb = ambiguous_embeddings[idx].reshape(1, -1)
                
                # Compute similarity with technical anchors
                similarities = np.dot(anchor_embeddings, candidate_emb.T).flatten()
                norms = np.linalg.norm(anchor_embeddings, axis=1) * np.linalg.norm(candidate_emb)
                cosine_sims = similarities / (norms + 1e-8)
                
                max_similarity = np.max(cosine_sims)
                
                # Higher threshold for cleaner filtering (0.45 instead of 0.35)
                if max_similarity >= 0.45:
                    known_technical.append(candidate)
        except Exception as e:
            logger.error(f"Semantic filtering error: {e}")
            # Continue with known technical terms only
    elif ambiguous and model is None:
        logger.warning("Embedding model not available, skipping semantic filtering")
    
    # Count frequency and filter
    candidate_counts = Counter(known_technical)
    
    # Filter overly frequent terms (likely filler words)
    total_words = len(jd_text.split())
    max_freq = max(1, int(total_words * 0.03))  # 3% threshold (stricter)
    filtered = {k: v for k, v in candidate_counts.items() if v <= max_freq}
    
    # Deduplicate similar terms (keep longer/more specific ones)
    final_keywords = []
    sorted_candidates = sorted(filtered.keys(), key=lambda x: (-len(x), -filtered[x]))
    
    for candidate in sorted_candidates:
        # Don't add if it's a substring of an already selected keyword
        is_redundant = any(
            (candidate in existing and candidate != existing) or 
            (existing in candidate and existing != candidate and len(existing) >= len(candidate) * 0.7)
            for existing in final_keywords
        )
        if not is_redundant:
            final_keywords.append(candidate)
    
    # Return top 35 keywords (reduced from 40 for cleaner results)
    logger.info(f"✅ Extracted {len(final_keywords)} keywords from JD")
    return final_keywords[:35]

def compute_keyword_match(resume_text: str, jd_text: str) -> dict:
    """
    Compute keyword match using hybrid approach:
    - Exact matching for known technical terms (fast)
    - Semantic matching for variations (fallback)
    
    Note: Results are not cached as resume text varies per user
    """
    logger.debug("Computing keyword match...")
    
    # Extract keywords from job description (cached)
    jd_keywords = simple_keywords_from_jd(jd_text)
    
    # Extract candidate phrases from resume
    resume_candidates = extract_candidate_phrases(resume_text)
    
    if not jd_keywords:
        logger.warning("No keywords extracted from JD")
        return {
            "required": 0,
            "matched": 0,
            "matches": [],
            "missing": []
        }
    
    if not resume_candidates:
        logger.warning("No candidate phrases extracted from resume")
        return {
            "required": len(jd_keywords),
            "matched": 0,
            "matches": [],
            "missing": jd_keywords
        }
    
    matches = []
    missing = []
    
    resume_text_lower = resume_text.lower()
    resume_candidates_set = set(resume_candidates)
    
    # First pass: Exact and substring matching (fast)
    for jd_keyword in jd_keywords:
        found = False
        
        # Exact match
        if jd_keyword in resume_candidates_set:
            matches.append(jd_keyword)
            found = True
        # Substring match (e.g., "python" in resume text)
        elif jd_keyword in resume_text_lower:
            matches.append(jd_keyword)
            found = True
        # Plural/singular variations
        elif jd_keyword + 's' in resume_text_lower or \
             (jd_keyword.endswith('s') and jd_keyword[:-1] in resume_text_lower):
            matches.append(jd_keyword)
            found = True
        
        if not found:
            missing.append(jd_keyword)
    
    # Second pass: Semantic matching for missing keywords (slower, only if needed)
    model = get_embedding_model()
    
    if missing and len(missing) < len(jd_keywords) * 0.7 and model is not None:
        try:
            # Filter out very short phrases from semantic matching
            semantic_missing = [k for k in missing if len(k) >= 4]
            
            if semantic_missing and resume_candidates_set:
                logger.debug(f"Attempting semantic matching for {len(semantic_missing)} keywords")
                
                jd_embeddings = model.encode(semantic_missing, convert_to_numpy=True)
                resume_embeddings = model.encode(list(resume_candidates_set), convert_to_numpy=True)
                
                semantic_matches = []
                for idx, jd_keyword in enumerate(semantic_missing):
                    jd_emb = jd_embeddings[idx].reshape(1, -1)
                    
                    # Compute similarities
                    similarities = np.dot(resume_embeddings, jd_emb.T).flatten()
                    norms = np.linalg.norm(resume_embeddings, axis=1) * np.linalg.norm(jd_emb)
                    cosine_sims = similarities / (norms + 1e-8)
                    
                    max_similarity = np.max(cosine_sims)
                    
                    # Higher threshold for semantic matching (0.7 instead of 0.6)
                    if max_similarity >= 0.7:
                        semantic_matches.append(jd_keyword)
                
                # Update matches and missing
                if semantic_matches:
                    logger.debug(f"✅ Semantic matching found {len(semantic_matches)} additional matches")
                    matches.extend(semantic_matches)
                    missing = [k for k in missing if k not in semantic_matches]
        except Exception as e:
            logger.error(f"Semantic matching error: {e}")
            # Continue with exact matches only
    elif missing and model is None:
        logger.warning("Embedding model not available, skipping semantic matching")
    
    result = {
        "required": len(jd_keywords),
        "matched": len(matches),
        "matches": matches,
        "missing": missing
    }
    
    logger.info(f"✅ Keyword matching complete: {len(matches)}/{len(jd_keywords)} matched")
    return result
