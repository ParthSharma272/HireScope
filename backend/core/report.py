# backend/core/report.py
from jinja2 import Environment, FileSystemLoader, select_autoescape
import weasyprint
import os
import io

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR), autoescape=select_autoescape())

def render_pdf_report(payload: dict):
    """
    Renders a simple HTML report into a PDF bytes using WeasyPrint.
    Ensure weasyprint and its system deps are installed (cairo, pango, gdk-pixbuf).
    """
    # ensure templates exist; we will create a minimal template string fallback
    try:
        template = env.get_template("report.html")
        html = template.render(payload=payload)
    except Exception:
        # minimal inline HTML
        html = f"""
        <html><body>
        <h1>HireScope Report</h1>
        <h2>Score: {payload.get('scores', {}).get('composite')}</h2>
        <p>{payload.get('insight','')}</p>
        </body></html>
        """
    pdf = weasyprint.HTML(string=html).write_pdf()
    return pdf
