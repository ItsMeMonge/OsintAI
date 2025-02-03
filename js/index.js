function renderDropTable(fileName) {
  d3.json(`framework/${fileName}`, (error, json) => {
    if (error) {
      console.error('Error loading JSON:', error);
      return;
    }

    const container = document.getElementById("tree-container");
    if (!container) {
      console.error('Container element not found');
      return;
    }
    
    container.innerHTML = "";
    createDropTable(json, container, true);
  });
}

function createDropTable(data, parentElement, isRoot = false) {
  if (!data || !parentElement) return;

  const wrapper = document.createElement("div");
  wrapper.className = `drop-wrapper ${isRoot ? 'root' : ''}`;

  const folderButton = document.createElement("button");
  folderButton.className = "drop-button";
  folderButton.innerText = data.name;
  
  wrapper.appendChild(folderButton);

  if (data.type === "url") {
    folderButton.classList.add("url");
    folderButton.title = data.url;

    folderButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    });

  } else {
    folderButton.title = "Click to expand/collapse";
    
    const sublist = document.createElement("div");
    sublist.className = "drop-children";
    sublist.style.display = isRoot ? "block" : "none";

    const toggleSublist = () => {
      const isExpanded = sublist.style.display === "block";
      sublist.style.display = isExpanded ? "none" : "block";
      folderButton.classList.toggle("expanded", !isExpanded);
    };

    folderButton.addEventListener("click", toggleSublist);

    if (data.children?.length) {
      data.children.forEach(child => createDropTable(child, sublist));
      wrapper.appendChild(sublist);
    }
  }

  parentElement.appendChild(wrapper);
}

function initializeApp() {
  const DEFAULT_LANG = "EN";
  
  async function loadPage(language) {
    try {
      const response = await fetch(`page/${language}.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      const elements = {
        "header-title": data.headerTitle,
        "notes-section-title": data.notesSectionTitle, 
        "notes-section-content": data.notesSectionContent,
        "updates-section-title": data.updatesSectionTitle,
        "updates-section-content": data.updatesSectionContent,
        "feedback-section-title": data.feedbackSectionTitle,
        "feedback-section-content": data.feedbackSectionContent,
        "footer-section-content": data.footerContent
      };

      Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
      });

      const legendItems = document.getElementById("legend-items");
      if (legendItems && data.legend) {
        legendItems.innerHTML = data.legend
          .map(item => `<p><span>${item.symbol}</span> - ${item.description}</p>`)
          .join('');
      }

    } catch (error) {
      console.error(`Error loading ${language}.json:`, error);
    }
  }
   
  async function changeLanguage() {
    const dropdown = document.getElementById("language-dropdown");
    if (!dropdown) return;

    const selectedLanguage = dropdown.value;
    document.body.classList.add("fade-out");

    try {
      await Promise.all([
        loadPage(selectedLanguage),
        renderDropTable(`${selectedLanguage}.json`)
      ]);

      document.body.classList.remove("fade-out");
      document.body.classList.add("fade-in");

      setTimeout(() => {
        document.body.classList.remove("fade-in");
      }, 1000);

    } catch (error) {
      console.error('Error changing language:', error);
      document.body.classList.remove("fade-out", "fade-in");
    }
  }

  // Initialize
  loadPage(DEFAULT_LANG);
  renderDropTable(`${DEFAULT_LANG}.json`);

  const languageDropdown = document.getElementById("language-dropdown");
  if (languageDropdown) {
    languageDropdown.addEventListener("change", changeLanguage);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);