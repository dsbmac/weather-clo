import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import './App.css';
import WeatherBtn from './components/WeatherBtn';

const useStyles = makeStyles({
    root: { justifyContent: 'center', alignItems: 'center', height: '100vh' },
    content: { justifyContent: 'center', alignItems: 'center' },
    message: { wordWrap: 'break-word' },
    item: { padding: '10px' }
});

function App() {
    const classes = useStyles();
    const [timestamp, setTimestamp] = useState(null);
    const [weather, setWeather] = useState({});
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [geoLocation, setGeoLocation] = useState(null);
    const [textContent, setTextContent] = useState('');

    const setError = (isErrorParam, errorMsg) => {
        setIsError(isErrorParam);
        setErrorMsg(errorMsg);
    };

    // const handleClickOLD = async () => {
    //     try {
    //         setError(false, '');
    //         geoLocate();
    //     } catch (error) {
    //         setError(true, error);
    //     }
    // };

    const locatesendGetWeatherRequest = async () => {
        try {
            const location = await geoLocate();
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
            const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
            console.log(resp.data);
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };

    const fetchWeather = async (params) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

        // Make a request for a user with a given ID
        return axios
            .get(url)
            .then(function (response) {
                // handle success
                return response.data;
            })
            .catch(function (error) {
                // handle error
                setError(true, error);
            });
    };

    const fetchWeatherV2 = async (location) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

        // Make a request for a user with a given ID
        return axios.get(url);
    };

    // refreshes data upon button click
    useEffect(() => {
        if (timestamp != null && geoLocation != null) {
            fetchWeather();
        }
    }, [geoLocation, timestamp]);

    const handle = (promise) => {
        return promise
            .then((data) => [data, undefined])
            .catch((error) => Promise.resolve([undefined, error]));
    };

    function getPosition(options) {
        return new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, options)
        );
    }

    async function geoLocate() {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;
            setGeoLocation(crd);
            setTimestamp(Date.now());
        }

        function error(err) {
            const newMsg = `ERROR(${err.code}): ${err.message}`;
            setError(true, newMsg);
        }

        return navigator.geolocation.getCurrentPosition(success, error, options);
    }

    const handleClick = async () => {
        try {
            const weather = await getWeather();
            setTextContent(JSON.stringify(weather.main));
        } catch (error) {
            setTextContent(error.message);
        }
    };
    async function getWeather() {
        let [location, locationErr] = await handle(getPosition());
        if (locationErr) throw new Error('Could not locate user');

        let [weatherResp, weatherErr] = await handle(fetchWeatherV2(location.coords));
        if (weatherErr) {
            throw new Error('Could not fetch weather');
        }
        return weatherResp.data;
    }

    return (
        <div className="App">
            <Grid container className={classes.root}>
                <Grid container className={classes.content}>
                    <Grid item xs={12} className={classes.item}>
                        <WeatherBtn handleClick={handleClick}></WeatherBtn>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <Typography className={classes.message}>{textContent}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
