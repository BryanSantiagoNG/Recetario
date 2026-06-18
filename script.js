function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });

    const activeSection = document.getElementById(sectionId);
    activeSection.classList.remove('hidden');
    activeSection.classList.add('active');
}

const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');

document.addEventListener('DOMContentLoaded', loadRecipes);

recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newRecipe = {
        id: Date.now(),
        title: document.getElementById('title').value,
        ingredients: document.getElementById('ingredients').value,
        image: document.getElementById('image').value || 'https://via.placeholder.com/300x200?text=Comida'
    };

    saveRecipe(newRecipe);
    recipeForm.reset();
    showSection('recetas');
    loadRecipes();
});

function saveRecipe(recipe) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
}

function loadRecipes() {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipeList.innerHTML = '';

    if(recipes.length === 0) {
        recipeList.innerHTML = '<p>No tienes recetas guardadas aún.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ingredientes:</strong> ${recipe.ingredients}</p>
            <button onclick="deleteRecipe(${recipe.id})" style="color: red; background: none; padding: 0; margin-top: 10px;">Eliminar</button>
        `;
        recipeList.appendChild(card);
    });
}

function deleteRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes'));
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    loadRecipes();
}