# ai-service/resume_parser.py
import PyPDF2
import docx
import mammoth
import openai
from io import BytesIO
import requests

class ResumeParser:
    def __init__(self, openai_api_key):
        openai.api_key = openai_api_key
    
    def extract_text_from_pdf(self, file_url):
        response = requests.get(file_url)
        pdf_file = BytesIO(response.content)
        
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    
    def extract_text_from_docx(self, file_url):
        response = requests.get(file_url)
        doc = docx.Document(BytesIO(response.content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    
    def analyze_resume_with_ai(self, resume_text):
        prompt = f"""
        Analyze this resume and extract the following information in JSON format:
        1. Skills (with proficiency levels 1-10)
        2. Experience (years and roles)
        3. Education
        4. ATS Score (1-100)
        5. Improvement suggestions
        
        Resume text:
        {resume_text}
        
        Return only valid JSON.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500
        )
        
        return response.choices[0].message.content
