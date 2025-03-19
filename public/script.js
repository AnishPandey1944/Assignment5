async function updateHitCount(pageID) {
    try {
      const response = await fetch(`/hits/${pageID}`);
      const data = await response.json();
      
      
      document.getElementById('hit-count').textContent = data.hits;
    } catch (error) {
      console.error('Error updating hit count:', error);
    }
  }
  
  async function updateAllHits() {
    try {
      const response = await fetch('/hits');
      const pages = await response.json();
      
      const allHitsList = document.getElementById('all-hits');
      allHitsList.innerHTML = '';

      pages.sort((a, b) => b.hits - a.hits);
      
      pages.forEach(page => {
        const li = document.createElement('li');
        li.textContent = `${page.pageID}: ${page.hits} hits`;
        allHitsList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching all hits:', error);
    }
  }