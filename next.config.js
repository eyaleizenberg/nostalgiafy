module.exports = {
  target: "serverless",
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/^encoding$/, /node-fetch/));
    return config;
  }
};
