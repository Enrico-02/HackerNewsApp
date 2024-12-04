import axios from 'axios';
import _ from 'lodash';
import './styles.css';


const API_BASE = process.env.API_BASE;
let currentIndex = 0;
const newsPerPage = 10;
let newsIDs = [];
async function fetchNewsIDs() {
    try {
      const response = await axios.get(`${API_BASE}/newstories.json`);
      newsIDs = response.data; // Lista degli ID
      loadNews();
    } catch (error) {
      console.error('Errore nel recupero degli ID:', error);
    }
  }
  async function fetchNewsDetails(id) {
    try {
      const response = await axios.get(`${API_BASE}/item/${id}.json`);
      return _.pick(response.data, ['title', 'url', 'time']);
    } catch (error) {
      console.error(`Errore nel recupero del dettaglio per ID ${id}:`, error);
    }
  }
  async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    const nextNews = newsIDs.slice(currentIndex, currentIndex + newsPerPage);
    currentIndex += newsPerPage;
  
    for (const id of nextNews) {
      const news = await fetchNewsDetails(id);
      if (news) {
        const newsItem = document.createElement('div');
        newsItem.innerHTML = `
          <h2><a href="${news.url}" target="_blank">${news.title}</a></h2>
          <p>${new Date(news.time * 1000).toLocaleDateString()}</p>
        `;
        newsContainer.appendChild(newsItem);
      }
    }
  }
  document.getElementById('load-more').addEventListener('click', loadNews);
  fetchNewsIDs();
