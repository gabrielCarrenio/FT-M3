module.exports = {
  date: () => {
    process.stdout.write(Date());
  },
  pwd: () => console.log(process.env.PWD),
};
