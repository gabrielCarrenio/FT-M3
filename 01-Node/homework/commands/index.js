var fs = require("fs");

const queSoy = fs.readdir(".", function (err, files) {
  if (err) throw err;
  files.forEach(function (file) {
    process.stdout.write(file.toString() + "\n");
  });
  process.stdout.write("prompt > ");
});

console.log("que soy:", queSoy);

module.exports = {
  date: () => {
    process.stdout.write(Date());
  },
  pwd: () => console.log(process.env.PWD),
};
