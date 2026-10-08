import os
import json
import urllib.request
import urllib.error

def app(environ, start_response):
    # Handle CORS OPTIONS
    if environ.get('REQUEST_METHOD') == 'OPTIONS':
        start_response('200 OK', [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, api-key')
        ])
        return [b'']

    # Reject non-POST requests
    if environ.get('REQUEST_METHOD') != 'POST':
        start_response('405 Method Not Allowed', [('Content-Type', 'application/json')])
        return [json.dumps({"error": "Method Not Allowed"}).encode('utf-8')]

    try:
        content_length = int(environ.get('CONTENT_LENGTH', 0))
        body = environ['wsgi.input'].read(content_length)

        endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "").rstrip('/')
        api_key = os.environ.get("AZURE_OPENAI_KEY", "")
        deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")
        api_version = "2024-12-01-preview"

        if not endpoint or not api_key:
            start_response('500 Internal Server Error', [('Content-Type', 'application/json')])
            return [json.dumps({"error": "Missing Azure OpenAI environment variables"}).encode('utf-8')]

        url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"

        req = urllib.request.Request(
            url,
            data=body,
            headers={
                'Content-Type': 'application/json',
                'api-key': api_key
            },
            method='POST'
        )

        with urllib.request.urlopen(req) as response:
            res_body = response.read()
            start_response('200 OK', [
                ('Access-Control-Allow-Origin', '*'),
                ('Content-Type', 'application/json')
            ])
            return [res_body]

    except urllib.error.HTTPError as e:
        err_body = e.read()
        start_response(f'{e.code} HTTP Error', [
            ('Access-Control-Allow-Origin', '*'),
            ('Content-Type', 'application/json')
        ])
        return [err_body]
    except Exception as e:
        start_response('500 Internal Server Error', [
            ('Access-Control-Allow-Origin', '*'),
            ('Content-Type', 'application/json')
        ])
        return [json.dumps({"error": str(e)}).encode('utf-8')]