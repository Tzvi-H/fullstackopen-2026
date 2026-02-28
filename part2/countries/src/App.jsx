import { useState, useEffect } from "react";
import axios from "axios";

const COUNTRIES_URL = "http://localhost:3001/countries";

const Countries = ({ countries, setSelectedCountry, countryToShow }) => {
  if (countryToShow) {
    return (
      <div>
        <h1>{countryToShow.name.common}</h1>
        <div>
          capital {countryToShow.capital[0]} <br />
          area {countryToShow.area}
        </div>
        <div>
          <h2>Languages</h2>
          <ul>
            {Object.values(countryToShow.languages).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </div>
        <div>
          <img src={countryToShow.flags.png} />
        </div>
      </div>
    );
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.name.common}>
            {country.name.common}
            <button
              onClick={() => {
                setSelectedCountry(country);
              }}
            >
              Show
            </button>
          </p>
        ))}
      </div>
    );
  }
};

const App = () => {
  const [countryInput, setCountryInput] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get(COUNTRIES_URL).then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleCountryChange = (e) => {
    setCountryInput(e.target.value);
    setSelectedCountry(null);
  };

  const matchedCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(countryInput.toLowerCase()),
  );

  let countryToShow;
  if (matchedCountries.length === 1) {
    countryToShow = matchedCountries[0];
  } else if (selectedCountry) {
    countryToShow = selectedCountry;
  }

  return (
    <div>
      <div>
        find countries
        <input value={countryInput} onChange={handleCountryChange} />
      </div>
      {countryInput.length > 0 && (
        <Countries
          countries={matchedCountries}
          setSelectedCountry={setSelectedCountry}
          countryToShow={countryToShow}
        />
      )}
    </div>
  );
};

export default App;
