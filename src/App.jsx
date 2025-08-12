import React, { useState } from 'react';

const GITHUB_API_URL = 'https://api.github.com';

function App() {
  const [files, setFiles] = useState({});
  const [commitMessage, setCommitMessage] = useState('Add generated files');
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  // Example: files = { 'index.html': 'content', 'src/App.jsx': 'content' }

  async function pushFilesToGitHub() {
    if (!repoOwner || !repoName || !token) {
      setStatus('Please provide repo owner, name, and token');
      return;
    }

    setStatus('Fetching latest commit SHA...');

    try {
      // Get reference to branch
      const refRes = await fetch(
        `${GITHUB_API_URL}/repos/${repoOwner}/${repoName}/git/ref/heads/${branch}`,
        {
          headers: { Authorization: `token ${token}` },
        }
      );
      if (!refRes.ok) throw new Error('Failed to get branch ref');
      const refData = await refRes.json();
      const latestCommitSha = refData.object.sha;

      setStatus('Fetching latest commit tree SHA...');

      // Get commit object
      const commitRes = await fetch(
        `${GITHUB_API_URL}/repos/${repoOwner}/${repoName}/git/commits/${latestCommitSha}`,
        {
          headers: { Authorization: `token ${token}` },
        }
      );
      if (!commitRes.ok) throw new Error('Failed to get commit object');
      const commitData = await commitRes.json();
      const baseTreeSha = commitData.tree.sha;

      setStatus('Creating blobs for files...');

      // Create blobs for each file
      const blobPromises = Object.entries(files).map(async ([path, content]) => {
        const blobRes = await fetch(
          `${GITHUB_API_URL}/repos/${repoOwner}/${repoName}/git/blobs`,
          {
            method: 'POST',
            headers: {
              Authorization: `token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, encoding: 'utf-8' }),
          }
        );
        if (!blobRes.ok) throw new Error(`Failed to create blob for ${path}`);
        const blobData = await blobRes.json();
        return { path, sha: blobData.sha, mode: '100644', type: 'blob' };
      });

      const treeItems = await Promise.all(blobPromises);

      setStatus('Creating new tree...');

      // Create new tree
      const treeRes = await fetch(
        `${GITHUB_API_URL}/repos/${repoOwner}/${repoName}/git/trees`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
        }
      );
      if (!treeRes.ok) throw new Error('Failed to create tree');
      const treeData = await treeRes.json();

      setStatus('Creating new commit...');

      // Create new commit
      const commitRes2 = await fetch(
        `${GITHUB_API_URL}/repos/${repoOwner}/${repoName}/git/commits`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            tree: treeData.sha,
            parents: [latestCommitSha],
          }),
        }
      );
      if (!commitRes2.ok) throw new Error('Failed to create commit');
      const commitData2 = await commitRes2.json();

      setStatus('Updating branch reference...');

      // Update branch ref
      const updateRefRes = await fetch(
        `${GITHUB_API_URL}/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sha: commitData2.sha }),
        }
      );
      if (!updateRefRes.ok) throw new Error('Failed to update branch ref');

      setStatus('Files pushed successfully!');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Code Generator with GitHub Push</h1>
      <div>
        <label>
          GitHub Repo Owner:{' '}
          <input value={repoOwner} onChange={e => setRepoOwner(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Repo Name: <input value={repoName} onChange={e => setRepoName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Branch: <input value={branch} onChange={e => setBranch(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          GitHub Token:{' '}
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Personal Access Token"
          />
        </label>
      </div>
      <div>
        <label>
          Commit Message:{' '}
          <input
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}
          />
        </label>
      </div>
      <button onClick={pushFilesToGitHub}>Push Files to GitHub</button>
      <div style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>{status}</div>
    </div>
  );
}

export default App;
