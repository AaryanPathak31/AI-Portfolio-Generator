# ai-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import ResumeParser
from github_analyzer import GitHubAnalyzer
import os

app = Flask(__name__)
CORS(app)

resume_parser = ResumeParser(os.getenv('OPENAI_API_KEY'))
github_analyzer = GitHubAnalyzer()

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    data = request.json
    resume_url = data.get('resume_url')
    
    try:
        if resume_url.endswith('.pdf'):
            text = resume_parser.extract_text_from_pdf(resume_url)
        else:
            text = resume_parser.extract_text_from_docx(resume_url)
        
        analysis = resume_parser.analyze_resume_with_ai(text)
        return jsonify({'success': True, 'analysis': analysis})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/analyze-github', methods=['POST'])
def analyze_github():
    data = request.json
    github_url = data.get('github_url')
    username = github_url.split('/')[-1]
    
    try:
        user_data = github_analyzer.get_user_data(username)
        repos = github_analyzer.get_repositories(username)
        analysis = github_analyzer.analyze_code_quality(repos)
        
        return jsonify({
            'success': True,
            'user_data': user_data,
            'analysis': analysis,
            'top_repos': sorted(repos, key=lambda x: x.get('stargazers_count', 0), reverse=True)[:3]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)