fetch('https://pokeapi.co/api/v2/berry/oran/')
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    console.log(json);
  });