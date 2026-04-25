#!/usr/bin/env python3
"""
Get number of task and its Node ID by branch name or PR. 
"""
import os
import re
import json
import urllib.request
import urllib.error

def graphql(query: str, token: str) -> dict:
    url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    req = urllib.request.Request(url, data=json.dumps({"query": query}).encode(), headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get_issue_node_id(owner: str, repo: str, number: int, token: str) -> str:
    query = f"""
    query {{
        repository(owner: "{owner}", name: "{repo}") {{
            issue(number: {number}) {{
                id
            }}
        }}
    }}
    """
    data = graphql(query, token)
    return data["data"]["repository"]["issue"]["id"]

def extract_issue_number_from_branch(branch_name: str) -> int | None:
    m = re.search(r"feature/(\d+)", branch_name)
    return int(m.group(1)) if m else None

def extract_issue_number_from_text(pr_title: str, pr_body: str) -> int | None:
    combined = f"{pr_title} {pr_body}"
    m = re.search(r"#(\d+)", combined)
    return int(m.group(1)) if m else None

def main():
    token = os.environ["GH_TOKEN"]
    repo_full = os.environ["REPOSITORY"]        # "owner/repo"
    owner, repo = repo_full.split("/")
    branch_name = os.environ.get("BRANCH_NAME", "")
    pr_title = os.environ.get("PR_TITLE", "")
    pr_body = os.environ.get("PR_BODY", "")

    issue_number = None
    if branch_name:
        issue_number = extract_issue_number_from_branch(branch_name)
    if not issue_number:
        issue_number = extract_issue_number_from_text(pr_title, pr_body)

    if not issue_number:
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write("issue-number=\nissue-node-id=\n")
        print("No issue number found, skipping status update.")
        return

    try:
        node_id = get_issue_node_id(owner, repo, issue_number, token)
    except Exception as e:
        print(f"Error fetching node id: {e}")
        node_id = ""

    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"issue-number={issue_number}\n")
        f.write(f"issue-node-id={node_id}\n")
    print(f"Issue #{issue_number} found, node_id={node_id}")

if __name__ == "__main__":
    main()
