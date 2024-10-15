import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';  // Para suportar HTML
import './Github.css'; // Estilos atualizados

const GitHubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  const username = 'SayesCode';

  const fetchRepos = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) throw new Error('Erro ao buscar os repositórios.');
      const data = await response.json();

      const reposWithDetails = await Promise.all(data.map(async (repo) => {
        const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
          headers: { Accept: 'application/vnd.github.v3.raw' }
        });
        const readme = await readmeResponse.text();

        // Corrigindo caminho relativo para imagens
        const fixedReadme = readme.replace(/\!\[([^\]]*)\]\((?!http)([^\)]+)\)/g, (match, alt, src) => {
          return `![${alt}](https://raw.githubusercontent.com/${username}/${repo.name}/main/${src})`;
        });

        const repoImage = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

        return { ...repo, readme: fixedReadme, repoImage };
      }));

      setRepos(reposWithDetails);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">Repositórios de {username}</h1>
      <div className="repo-grid">
        {repos.length > 0 ? (
          repos.map((repo) => (
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" key={repo.id} className="repo-card">
              <div className="repo-header">
                <img src={repo.repoImage} alt={`${repo.name} thumbnail`} className="repo-image" />
                <div className="repo-details">
                  <h2>{repo.name}</h2>
                  <p>{new Date(repo.created_at).toDateString()}</p>
                </div>
              </div>
              <p>{repo.description}</p>
              <div className="repo-readme">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{repo.readme}</ReactMarkdown> {/* Suporta HTML embutido */}
              </div>
            </a>
          ))
        ) : (
          <p>Carregando repositórios...</p>
        )}
      </div>
    </div>
  );
};

export default GitHubRepos;
