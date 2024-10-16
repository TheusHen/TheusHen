import React, { useEffect, useState } from 'react';
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

      // Adiciona apenas o nome e a descrição dos repositórios
      const reposWithDetails = data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        created_at: repo.created_at,
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
                <div className="repo-details">
                  <h2>{repo.name}</h2>
                  <p>{repo.description || 'Sem descrição'}</p> {/* Exibe 'Sem descrição' se não houver descrição */}
                  <p>{new Date(repo.created_at).toDateString()}</p>
                </div>
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
