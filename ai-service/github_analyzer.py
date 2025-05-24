# ai-service/github_analyzer.py
import requests
import json
from datetime import datetime

class GitHubAnalyzer:
    def __init__(self):
        self.base_url = "https://api.github.com"
    
    def get_user_data(self, username):
        url = f"{self.base_url}/users/{username}"
        response = requests.get(url)
        return response.json() if response.status_code == 200 else None
    
    def get_repositories(self, username):
        url = f"{self.base_url}/users/{username}/repos"
        response = requests.get(url)
        return response.json() if response.status_code == 200 else []
    
    def analyze_code_quality(self, repos):
        total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
        total_forks = sum(repo.get('forks_count', 0) for repo in repos)
        languages = {}
        
        for repo in repos:
            if repo.get('language'):
                languages[repo['language']] = languages.get(repo['language'], 0) + 1
        
        return {
            'total_repos': len(repos),
            'total_stars': total_stars,
            'total_forks': total_forks,
            'primary_languages': languages,
            'activity_score': min(100, (total_stars + total_forks) * 2)
        }
