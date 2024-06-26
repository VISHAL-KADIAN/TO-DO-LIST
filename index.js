import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"todolist",
    password:"kenny69",
    port:5433
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  try{
    const result=await db.query("SELECT * FROM items ORDER BY id ASC ");
    items=result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
     listItems: items,
    });
  }catch{
   console.error("UNABLE TO PROCESS THE REQUEST");
  }
  
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;

  const newitem={
    id:items.length+1,
    title : item
  }
  try{
    await db.query("INSERT INTO items (id,title) VALUES($1,$2)",
      [newitem.id,newitem.title]
    )
    items.push({ title: item });
    res.redirect("/");
  }catch{
  console.error("UNABLE TO PROCESS THE ERROR");
  }
 
});

app.post("/edit", async(req, res) => {
  const id=req.body.updatedItemId;
  const title=req.body.updatedItemTitle;
  
  try{
  await db.query("UPDATE items SET title=($1) WHERE id=$2",
    [title,id]);
  
  res.redirect("/")
}catch{
  console.error("COULD NOT PROCESS THE REQUEST");
}
}
);


app.post("/delete", async(req, res) => {
  const id=req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id=$1",[id])
    res.redirect("/");

  }catch{
    console.error("COULD NOT PROCESS THE REQUEST");
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
