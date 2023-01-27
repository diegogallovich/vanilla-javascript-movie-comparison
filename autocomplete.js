const createAutocompleteComponent = ({
  root,
  getOptions,
  renderOption,
  onOptionSelect,
  createInputValue,
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
        </div>
    </div>
`;

  const input = root.querySelector('.input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  // Event handlers
  const onInputEvent = async (e) => {
    if (!e.target.value) {
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML = '';

    try {
      const options = await getOptions(e.target.value);

      if (!options.length) {
        return;
      }

      dropdown.classList.add('is-active');

      options.map((option) => {
        const optionElement = document.createElement('a');
        optionElement.classList.add('dropdown-item');
        optionElement.innerHTML = renderOption(option);
        optionElement.addEventListener('click', () => {
          dropdown.classList.remove('is-active');
          input.value = createInputValue(option);
          onOptionSelect(option);
        });

        resultsWrapper.appendChild(optionElement);
      });
    } catch (error) {
      if (error instanceof TypeError) {
        console.log('type error', error.message);
      } else {
        console.log('Got unhandled error onInputEvent', error);
      }
    }
  };

  // Event listeners
  document.addEventListener('click', (e) => {
    // close dropdown if click outside of autocomplete
    if (!root.contains(e.target)) {
      dropdown.classList.remove('is-active');
    }
  });

  input.addEventListener('input', debounce(onInputEvent, 1000));
};
