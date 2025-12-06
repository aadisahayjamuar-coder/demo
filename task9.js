
    const content = document.getElementById('content');
    const form = document.getElementById('searchForm');
    const input = document.getElementById('q');
    const submitBtn = document.getElementById('submitBtn');

    // Open‑Meteo weather code → text + emoji [web:21][web:22]
    const weatherCodeMap = {
      0:{t:'Clear sky',e:'☀️'},
      1:{t:'Mainly clear',e:'🌤️'},
      2:{t:'Partly cloudy',e:'⛅'},
      3:{t:'Overcast',e:'☁️'},
      45:{t:'Fog',e:'🌫️'},
      48:{t:'Rime fog',e:'🌫️'},
      51:{t:'Light drizzle',e:'🌦️'},
      53:{t:'Drizzle',e:'🌦️'},
      55:{t:'Heavy drizzle',e:'🌧️'},
      61:{t:'Light rain',e:'🌦️'},
      63:{t:'Rain',e:'🌧️'},
      65:{t:'Heavy rain',e:'🌧️'},
      66:{t:'Freezing rain',e:'🌨️'},
      67:{t:'Heavy freezing rain',e:'🌨️'},
      71:{t:'Light snow',e:'❄️'},
      73:{t:'Snow',e:'❄️'},
      75:{t:'Heavy snow',e:'❄️'},
      77:{t:'Snow grains',e:'❄️'},
      80:{t:'Rain showers',e:'🌦️'},
      81:{t:'Rain showers',e:'🌦️'},
      82:{t:'Heavy showers',e:'🌧️'},
      85:{t:'Snow showers',e:'🌨️'},
      86:{t:'Heavy snow showers',e:'🌨️'},
      95:{t:'Thunderstorm',e:'⛈️'},
      96:{t:'Thunderstorm, hail',e:'⛈️'},
      99:{t:'Thunderstorm, hail',e:'⛈️'}
    };

    // Convert degrees → 16‑point compass direction [web:41][web:45]
    function degToCompass(deg){
      const dirs=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
      const ix=Math.round(deg/22.5)%16;
      return dirs[ix];
    }

    // Format local ISO string to something nicer
    function fmtLocalISO(dtStr){
      if(!dtStr) return '–';
      return dtStr.replace('T',' · ');
    }

    async function geocodePlace(q){
      const url = new URL('https://geocoding-api.open-meteo.com/v1/search'); // [web:26][web:42]
      url.searchParams.set('name', q);
      url.searchParams.set('count', '1');
      url.searchParams.set('language', 'en');
      url.searchParams.set('format', 'json');

      const res = await fetch(url);
      if(!res.ok) throw new Error('Geocoding failed. Please try again.');
      const data = await res.json();
      if(!data.results || data.results.length === 0){
        throw new Error('No matching place found. Try another name or spelling.');
      }
      const r = data.results[0];
      return {
        name: r.name,
        country: r.country,
        lat: r.latitude,
        lon: r.longitude,
        timezone: r.timezone
      };
    }

    async function getWeather(lat, lon, timezone){
      const url = new URL('https://api.open-meteo.com/v1/forecast');        // [web:21][web:22][web:31]
      url.searchParams.set('latitude', String(lat));
      url.searchParams.set('longitude', String(lon));
      url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,apparent_temperature');
      url.searchParams.set('timezone', timezone);

      const res = await fetch(url);
      if(!res.ok) throw new Error('Weather fetch failed. Please try again.');
      const data = await res.json();
      const c = data.current;
      if(!c) throw new Error('No current weather data available for this location.');
      return {
        temperature: c.temperature_2m,
        feelsLike: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        weatherCode: c.weather_code,
        windSpeed: c.wind_speed_10m,
        windDirection: c.wind_direction_10m,
        time: c.time
      };
    }

    function renderStatus(msg, isError=false){
      content.innerHTML = `<p class="status ${isError?'error':''}">${msg}</p>`;
    }

    function buildAdvice(w){
      if(w.temperature <= 10) return 'It is quite cold. Wear warm layers and a jacket if you are going out.';
      if(w.temperature >= 32) return 'Very hot conditions. Drink plenty of water and avoid peak sun hours.';
      if(w.humidity >= 80 && w.temperature >= 25) return 'It feels humid and warm. Light, breathable clothes are recommended.';
      if(w.weatherCode >= 80 && w.weatherCode <= 82) return 'Showers are likely. Carry an umbrella or a light raincoat.';
      if(w.weatherCode >= 61 && w.weatherCode <= 67) return 'Rain expected. Roads may be slippery, so travel carefully.';
      return 'Weather looks comfortable. Still, check any local alerts if you plan long trips.';
    }

    function renderWeather(place, w){
      const wc = weatherCodeMap[w.weatherCode] || {t:'Unknown', e:'❓'};
      const cardinal = degToCompass(w.windDirection);
      const advice = buildAdvice(w);

      content.innerHTML = `
        <div class="location">
          <div>
            <div class="name">${place.name}, ${place.country}</div>
            <div class="meta">Lat ${place.lat.toFixed(2)}, Lon ${place.lon.toFixed(2)}</div>
          </div>
          <div class="temp">${Math.round(w.temperature)}°C</div>
        </div>

        <div class="grid" role="list">
          <div class="item" role="listitem">
            <div class="label">Condition</div>
            <div class="value">${wc.t} ${wc.e}</div>
          </div>
          <div class="item" role="listitem">
            <div class="label">Feels like</div>
            <div class="value">${Math.round(w.feelsLike)}°C</div>
          </div>
          <div class="item" role="listitem">
            <div class="label">Wind</div>
            <div class="value">${w.windSpeed.toFixed(1)} km/h</div>
          </div>
          <div class="item" role="listitem">
            <div class="label">Direction</div>
            <div class="value">${Math.round(w.windDirection)}° (${cardinal})</div>
          </div>
          <div class="item" role="listitem">
            <div class="label">Humidity</div>
            <div class="value">${Math.round(w.humidity)}%</div>
          </div>
          <div class="item" role="listitem">
            <div class="label">Local time</div>
            <div class="value">${fmtLocalISO(w.time)}</div>
          </div>
        </div>

        <div class="advice">${advice}</div>
      `;
    }

    function setLoading(isLoading){
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? 'Checking…' : 'Check';
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const q = input.value.trim();
      if(!q){
        renderStatus('Please enter a city or place.');
        return;
      }
      setLoading(true);
      renderStatus('Fetching weather. Please wait…');
      try{
        const place = await geocodePlace(q);
        const weather = await getWeather(place.lat, place.lon, place.timezone);
        renderWeather(place, weather);
      }catch(err){
        renderStatus(err.message || 'Something went wrong. Try again.', true);
      }finally{
        setLoading(false);
      }
    });

    // Optional: prefill an example city
    window.addEventListener('DOMContentLoaded', ()=>{
      input.value = 'Melbourne';
    });