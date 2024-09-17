import React, { useState, useEffect } from "react";

export default function Main() {
  const baseUrl = "https://restcountries.com/v3.1/all";
  const [arr, setArr] = useState([]); // Barcha davlatlar ma'lumotlari
  const [dataObj, setDataObj] = useState(null); // Modalda ko'rsatiladigan davlat ma'lumotlari
  const [search, setSearch] = useState(""); // Qidiruv so'zi

  // Davlatlarni olish va holatga saqlash
  async function getData() {
    try {
      const res = await fetch(baseUrl);
      const data = await res.json();
      setArr(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // Qidiruv so'zi bo'yicha filtrlash
  const filteredCountries = arr.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  // Modalni yopish
  function closeModal() {
    setDataObj(null);
  }

  // Tanlangan davlat ma'lumotlarini modalga qo'shish
  function dataInfo(index) {
    const selectedCountry = filteredCountries[index];
    setDataObj(selectedCountry);
  }

  // Window bosilganda modalni yopish uchun listener qo'shish
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.classList.contains("modal-bg")) {
        closeModal(); // Modalni yopish
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto">
      {/* Modalni ko'rsatish */}
      {dataObj && (
        <div className="fixed z-50 w-full h-screen bg-[rgba(0,0,0,0.9)] top-0 left-0 flex justify-center items-center modal-bg">
          <div className="relative w-full max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <button
              onClick={closeModal}
              className="absolute bg-blue-500 rounded-md font-bold hover:bg-red-500 -top-0 -right-10 text-gray-300 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5 text-white">
              {/* Bayroq */}
              <div className="w-full h-48">
                <img
                  className="rounded-t-lg w-full h-full object-cover"
                  src={dataObj.flags.png}
                  alt={dataObj.name.common}
                />
              </div>

              {/* Asosiy ma'lumotlar */}
              <div className="mt-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight">
                  Country: {dataObj.name.common}
                </h5>
                <p className="mb-3 font-normal text-gray-400">Region: {dataObj.region}</p>
                <p className="mb-3 font-normal text-gray-400">
                  Population: {dataObj.population.toLocaleString()}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                  Capital: {dataObj.capital?.[0] || 'N/A'}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                  Area: {dataObj.area.toLocaleString()} km²
                </p>
                <p className="mb-3 font-normal text-gray-400">
                  Subregion: {dataObj.subregion || 'N/A'}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                  Timezones: {dataObj.timezones?.join(', ') || 'N/A'}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                  Currencies: {dataObj.currencies
                    ? Object.values(dataObj.currencies).map(currency => currency.name).join(', ')
                    : 'N/A'}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                  Languages: {dataObj.languages
                    ? Object.values(dataObj.languages).join(', ')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Qidiruv input */}
      <div className="w-full p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Davlatni qidiring..."
          className="p-2 outline-none bg-gray-700 placeholder:text-gray-400 text-white shadow-lg rounded w-full"
        />
      </div>

      {/* Davlat kartalari */}
      <div className="grid grid-cols-5 gap-5">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country, index) => (
            <div
              key={index}
              className="max-w-sm h-[380px] pb-3 bg-gradient-to-b from-gray-800 via-gray-900 to-black border border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              <div className="w-full h-1/2">
                <img
                  className="rounded-t-lg w-full h-full "
                  src={country.flags.png}
                  alt={country.name.common}
                />
              </div>
              <div className="px-4 h-1/2 flex flex-col gap-4 items-start justify-center">
                <h5 className="text-[16px] h-[50px] flex justify-center items-center font-bold tracking-tight text-gray-200">
                  {country.name.common}
                </h5>
                <p className="font-normal text-gray-400">
                  Region: {country.region}
                </p>
                <p className="font-normal text-gray-400">
                  Population: {country.population.toLocaleString()}
                </p>
                <button
                  onClick={() => dataInfo(index)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300"
                >
                  Read more
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Yuklanmoqda...</p>
        )}
      </div>
    </div>
  );
}
