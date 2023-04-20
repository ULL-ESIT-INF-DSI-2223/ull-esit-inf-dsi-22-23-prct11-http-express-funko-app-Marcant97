import request from 'request';

const weatherInfo = (location: string, callback: (
  err: string | undefined, data: request.Response | undefined) => void) => {
  const url = `http://api.weatherstack.com/current?access_key=aeb97bf5fbae1e796215bb0be875d548&query=${encodeURIComponent(location)}&units=m`;

  request({url: url, json: true}, (error: Error, response) => {
    if (error) {
      callback(`Weatherstack API is not available: ${error.message}`,
          undefined);
    } else if (response.body.error) {
      callback(`Weatherstack API error: ${response.body.error.type}`,
          undefined);
    } else {
      callback(undefined, response);
    }
  });
};

weatherInfo(process.argv[2], (err, data) => {
  if (err) {
    console.log(err);
  } else if (data) {
    console.log(data.body);
  }
});