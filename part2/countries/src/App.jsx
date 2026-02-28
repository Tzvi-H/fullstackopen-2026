import { useState, useEffect } from "react";
import axios from "axios";

const COUNTRIES_URL = "https://studies.cs.helsinki.fi/restcountries/api/all";

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.name.common}>{country.name.common}</p>
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    const country = countries[0];
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>
          capital {country.capital[0]} <br />
          area {country.area}
        </div>
        <div>
          <h2>Languages</h2>
          <ul>
            {Object.values(country.languages).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </div>
        <div>
          <img src={country.flags.png} />
        </div>
      </div>
    );
  }
};

const App = () => {
  const [countryInput, setCountryInput] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get(COUNTRIES_URL).then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleCountryChange = (e) => setCountryInput(e.target.value);

  const matchedCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(countryInput.toLowerCase()),
  );

  return (
    <div>
      <div>
        find countries
        <input value={countryInput} onChange={handleCountryChange} />
      </div>
      <Countries countries={matchedCountries} />
    </div>
  );
};

export default App;
