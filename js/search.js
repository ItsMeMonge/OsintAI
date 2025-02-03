function searchTree() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const nodes = document.querySelectorAll(".drop-wrapper");
    const TextResult = document.getElementById("TreeSearchResult")

    let hasResults = false;

    nodes.forEach(node => {
        const button = node.querySelector(".drop-button");
        const sublist = node.querySelector(".drop-children");
        const nodeText = button.innerText.toLowerCase();

        if (searchTerm && nodeText.includes(searchTerm)) {
            button.style.backgroundColor = "rgb(21 28 74 / 50%)";
            node.style.display = "block";
            expandParents(node);
            if (sublist) sublist.style.display = "block";
            hasResults = true;
        } else {
            TextResult.innerText = ""
            button.style.backgroundColor = "";
            node.style.display = "none";
        }
    });

    if (!searchTerm) {
        TextResult.innerText = ""
        resetTree(); 
    } else if (!hasResults) {
        TextResult.innerText = "No results found... ( ◡́.◡̀)"
    }
}

function expandParents(node) {
    let parent = node.closest(".drop-wrapper");

    while (parent) {
        parent.style.display = "block";
        const button = parent.querySelector(".drop-button");
        const sublist = parent.querySelector(".drop-children");
        if (button) {
            button.classList.add("expanded");
        }
        if (sublist) {
            sublist.style.display = "block"; 
        }

        parent = parent.parentElement.closest(".drop-wrapper");
    }
}

function resetTree() {
    document.querySelectorAll(".drop-wrapper").forEach(node => {
        node.style.display = "block";
        const button = node.querySelector(".drop-button");
        const sublist = node.querySelector(".drop-children");
        button.style.backgroundColor = "";
        if (sublist) sublist.style.display = "none";
    });
}
