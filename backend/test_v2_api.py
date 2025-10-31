#!/usr/bin/env python3
"""
Quick test script to verify v2.0.0 API returns enhanced AI suggestions
"""
import requests
import json

# Test data
SAMPLE_RESUME = """
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

EXPERIENCE
Software Developer at Tech Corp (2020-2023)
- Built web applications
- Worked on team projects
- Fixed bugs

EDUCATION
Bachelor of Science in Computer Science
State University, 2020

SKILLS
Python, JavaScript, HTML, CSS
"""

SAMPLE_JD = """
Senior Software Engineer - Machine Learning

We're looking for an experienced ML Engineer with:
- 5+ years in Python and TensorFlow/PyTorch
- Deep learning and machine learning expertise
- Experience with AWS, Docker, Kubernetes
- Real-world ML deployment experience
- Strong background in NLP and computer vision
- Full-time, hands-on experience required
- GCP/Azure experience is a plus
"""

def test_upload_endpoint():
    """Test /api/resume/upload endpoint"""
    print("🔍 Testing /api/resume/upload endpoint...")
    
    # Create a simple text file
    files = {
        'file': ('resume.txt', SAMPLE_RESUME.encode(), 'text/plain')
    }
    data = {
        'job_description': SAMPLE_JD
    }
    
    response = requests.post('http://localhost:8000/api/resume/upload', files=files, data=data)
    
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None
    
    result = response.json()
    print(f"✅ Upload successful!")
    print(f"\n📊 Response includes:")
    print(f"   - scores: {'✓' if 'scores' in result else '✗'}")
    print(f"   - keywords: {'✓' if 'keywords' in result else '✗'}")
    print(f"   - insight (old): {'✓' if 'insight' in result else '✗'}")
    print(f"   - ai_suggestions (NEW v2.0): {'✓' if 'ai_suggestions' in result else '✗'}")
    print(f"   - rag_suggestions: {'✓' if 'rag_suggestions' in result else '✗'}")
    
    # Check AI suggestions structure
    if 'ai_suggestions' in result and result['ai_suggestions']:
        ai = result['ai_suggestions']
        print(f"\n🎯 AI Suggestions v2.0 Structure:")
        print(f"   - summary: {'✓' if 'summary' in ai else '✗'}")
        print(f"   - ats_compatibility: {'✓' if 'ats_compatibility' in ai else '✗'}")
        print(f"   - gap_analysis: {'✓' if 'gap_analysis' in ai else '✗'}")
        print(f"   - action_items: {'✓' if 'action_items' in ai else '✗'}")
        print(f"   - quick_wins: {'✓' if 'quick_wins' in ai else '✗'}")
        print(f"   - competitive_analysis: {'✓' if 'competitive_analysis' in ai else '✗'}")
        
        if 'summary' in ai:
            print(f"\n📈 Summary:")
            print(f"   - Overall Grade: {ai['summary'].get('overall_grade', 'N/A')}")
            print(f"   - Critical Issues: {ai['summary'].get('critical_count', 0)}")
            print(f"   - High Priority: {ai['summary'].get('high_priority_count', 0)}")
            print(f"   - Message: {ai['summary'].get('message', 'N/A')[:80]}...")
        
        if 'ats_compatibility' in ai:
            print(f"\n🤖 ATS Compatibility:")
            print(f"   - Score: {ai['ats_compatibility'].get('score', 0)}/100")
            print(f"   - Issues: {len(ai['ats_compatibility'].get('issues', []))} found")
        
        if 'quick_wins' in ai and ai['quick_wins']:
            print(f"\n⚡ Quick Wins ({len(ai['quick_wins'])}):")
            for i, win in enumerate(ai['quick_wins'][:3], 1):
                print(f"   {i}. {win[:70]}...")
    else:
        print("\n⚠️ WARNING: ai_suggestions not found in response!")
    
    return result

def test_live_endpoint():
    """Test /api/live/live-analyze endpoint"""
    print("\n\n🔍 Testing /api/live/live-analyze endpoint...")
    
    data = {
        'resume_text': SAMPLE_RESUME,
        'job_description': SAMPLE_JD
    }
    
    response = requests.post('http://localhost:8000/api/live/live-analyze', data=data)
    
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None
    
    result = response.json()
    print(f"✅ Live analysis successful!")
    print(f"\n📊 Response includes:")
    print(f"   - scores: {'✓' if 'scores' in result else '✗'}")
    print(f"   - keywords: {'✓' if 'keywords' in result else '✗'}")
    print(f"   - insight (old): {'✓' if 'insight' in result else '✗'}")
    print(f"   - ai_suggestions_summary (NEW v2.0): {'✓' if 'ai_suggestions_summary' in result else '✗'}")
    
    if 'ai_suggestions_summary' in result and result['ai_suggestions_summary']:
        summary = result['ai_suggestions_summary']
        print(f"\n🎯 AI Suggestions Summary:")
        print(f"   - Overall Grade: {summary.get('overall_grade', 'N/A')}")
        print(f"   - Critical Issues: {summary.get('critical_count', 0)}")
        print(f"   - Quick Wins: {len(summary.get('quick_wins', []))}")
        print(f"   - Est. Time: {summary.get('estimated_time', 'N/A')}")
        
        if summary.get('quick_wins'):
            print(f"\n⚡ Quick Wins:")
            for i, win in enumerate(summary['quick_wins'], 1):
                print(f"   {i}. {win[:70]}...")
    else:
        print("\n⚠️ WARNING: ai_suggestions_summary not found in response!")
    
    return result

if __name__ == "__main__":
    print("=" * 80)
    print("🚀 HireScope v2.0.0 API Test")
    print("=" * 80)
    
    try:
        # Test upload endpoint
        upload_result = test_upload_endpoint()
        
        # Test live endpoint
        live_result = test_live_endpoint()
        
        print("\n" + "=" * 80)
        print("✅ All tests completed!")
        print("=" * 80)
        
        # Save response to file for inspection
        if upload_result:
            with open('/tmp/hirescope_v2_response.json', 'w') as f:
                json.dump(upload_result, f, indent=2)
            print("\n💾 Full response saved to: /tmp/hirescope_v2_response.json")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to backend at http://localhost:8000")
        print("   Make sure the backend server is running!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
