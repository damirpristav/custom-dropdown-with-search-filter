// Get dropdowns and form
const dropdowns = document.querySelectorAll('[data-dropdown]');
const form = document.querySelector('form');

// Check if dropdowns exist on page
if(dropdowns.length > 0) {
  // Loop through dropdowns and create custom dropdown for each select element
  dropdowns.forEach(dropdown => {
    createCustomDropdown(dropdown);
  });
}

// Check if form element exist on page
if(form !== null) {
  // When form is submitted console log the value of the select field
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Selected country:', form.querySelector('[name="country"]').value);
  });
}

// Create custom dropdown
function createCustomDropdown(dropdown) {
  // Get all options and convert them from nodelist to array
  const options = dropdown.querySelectorAll('option');
  const optionsArr = Array.prototype.slice.call(options);

  // Create custom dropdown element and add class dropdown to it
  // Insert it in the DOM after the select field
  const customDropdown = document.createElement('div');
  customDropdown.classList.add('dropdown');
  dropdown.insertAdjacentElement('afterend', customDropdown);

  // Create element for selected option
  // Add class to this element, text from the first option in select field and append it to custom dropdown
  const selected = document.createElement('div');
  selected.classList.add('dropdown__selected');
  selected.textContent = optionsArr[0].textContent;
  customDropdown.appendChild(selected);

  // Create element for dropdown menu, add class to it and append it to custom dropdown
  // Add click event to selected element to toggle dropdown menu
  const menu = document.createElement('div');
  menu.classList.add('dropdown__menu');
  customDropdown.appendChild(menu);
  selected.addEventListener('click', toggleDropdown.bind(menu));

  // Create serach input element
  // Add class, type and placeholder to this element and append it to menu element
  const search = document.createElement('input');
  search.placeholder = 'Search...';
  search.type = 'text';
  search.classList.add('dropdown__menu_search');
  menu.appendChild(search);

  // Create wrapper element for menu items, add class to it and append to menu element
  const menuItemsWrapper = document.createElement('div');
  menuItemsWrapper.classList.add('dropdown__menu_items');
  menu.appendChild(menuItemsWrapper);

  // Loop through all options and create custom option for each option and append it to items wrapper element
  // Add click event for each custom option to set clicked option as selected option
  optionsArr.forEach(option => {
    const item = document.createElement('div');
    item.classList.add('dropdown__menu_item');
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    menuItemsWrapper.appendChild(item);

    item.addEventListener('click', setSelected.bind(item, selected, dropdown, menu));
  });

  // Add selected class to first custom option
  menuItemsWrapper.querySelector('div').classList.add('selected');

  // Add input event to search input element to filter items
  // Add click event to document element to close custom dropdown if clicked outside of it
  // Hide original dropdown(select)
  search.addEventListener('input', filterItems.bind(search, optionsArr, menu));
  document.addEventListener('click', closeIfClickedOutside.bind(customDropdown, menu));
  dropdown.style.display = 'none';
}

// Toggle dropdown
function toggleDropdown() {
  // Check if dropdown is opened and if it is close it, otherwise open it and focus search input
  if(this.offsetParent !== null) {
    this.style.display = 'none';
  }else {
    this.style.display = 'block';
    this.querySelector('input').focus();
  }
}

// Set selected option
function setSelected(selected, dropdown, menu) {
  // Get value and label from clicked custom option
  const value = this.dataset.value;
  const label = this.textContent;

  // Change the text on selected element
  // Change the value on select field
  selected.textContent = label;
  dropdown.value = value;

  // Close the menu
  // Reset search input value
  // Remove selected class from previously selected option and show all divs if they were filtered
  // Add selected class to clicked option
  menu.style.display = 'none';
  menu.querySelector('input').value = '';
  menu.querySelectorAll('div').forEach(div => {
    if(div.classList.contains('selected')) {
      div.classList.remove('selected');
    }
    if(div.offsetParent === null) {
      div.style.display = 'block';
    }
  });
  this.classList.add('selected');
}

// Filter items
function filterItems(itemsArr, menu) {
  // Get all custom options
  // Get the value of search input and convert it to all lowercase characters
  // Get filtered items
  // Get the indexes of filtered items
  const customOptions = menu.querySelectorAll('.dropdown__menu_items div');
  const value = this.value.toLowerCase();
  const filteredItems = itemsArr.filter(item => item.value.toLowerCase().includes(value));
  const indexesArr = filteredItems.map(item => itemsArr.indexOf(item));

  // Check if option is not inside indexes array and hide it and if it is inside indexes array and it is hidden show it
  itemsArr.forEach(option => {
    if(!indexesArr.includes(itemsArr.indexOf(option))) {
      customOptions[itemsArr.indexOf(option)].style.display = 'none';
    }else {
      if(customOptions[itemsArr.indexOf(option)].offsetParent === null) {
        customOptions[itemsArr.indexOf(option)].style.display = 'block';
      }
    }
  });
}

// Close dropdown if clicked outside dropdown element
function closeIfClickedOutside(menu, e) {
  if(e.target.closest('.dropdown') === null && e.target !== this && menu.offsetParent !== null) {
    menu.style.display = 'none';
  }
}