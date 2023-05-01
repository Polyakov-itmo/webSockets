const aa_sqlite = require("aa-sqlite");

async function test() {
  try {
    console.log("connected");
    await aa_sqlite.open("./book4.db");
  } catch (err) {
    console.log(err);
  }

  try {
    var data = await aa_sqlite.all("SELECT * FROM liq");
    console.log(data);
  } catch (err) {
    console.log(err);
  }

  aa_sqlite.close();
}

test();
