const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// posting sub info
exports.getRecords = async function getRecords(doc) {
  const snapshot = await db.collection('abstracts').orderBy("random").limit(10).get();
  arr = [];
snapshot.forEach((doc) => {

    arr.push(doc.data())
  });
};


exports.getSearchRecords = async function getSearchRecords(keyword) {
  const snapshot = await db.collection('abstracts').get();
  arr = [];
  snapshot.forEach((doc) => {
    
    let combine = doc.data()["title"] + doc.data()["category"] + doc.data()["subcategory"] + doc.data()["abstract"] + doc.data()["phrase1"] + doc.data()["phrase2"] + doc.data()["author"];

    try {

      if(combine.toLowerCase().includes(keyword.toLowerCase())) {
        
        arr.push(doc.data())
      }
    }
    catch(err) {
      console.log(err)
    }
   
  });
};

exports.getFilterRecords = async function getFilterRecords(reqObj) {

  // extract each field of the rejObject i.e. reqObj["title"]
  // let arr = []
  // loop over each record in firestore
  // if the abstract at index i contains any of the fields extracted above^
  // append to list with arr.push(doc.data()), same as above
  // return a list similar to the other list returned for searching

  const snapshot = await db.collection('abstracts').get();
  arr = [];
  snapshot.forEach((doc) => {

    filterlist = ["title", "author", "year", "category", "subcategory", "phrase1"]

    let i = filterlist.length - 1;
    while (i >= 0) {
      if (reqObj[filterlist[i]] == null) { 
          filterlist.splice(i, 1);
      } 
      i--
  }
    
    let title = doc.data()["title"]
    let author = doc.data()["author"]
    let year = doc.data()["year"].toString()
    let category = doc.data()["category"]
    let subcategory = doc.data()["subcategory"]
    let hypothesisobjective = doc.data()["phrase1"]

    let totalsearchspace = {title, author, year, category, subcategory, hypothesisobjective}

    try {

      flag = true

      for (i = 0; i < filterlist.length; i++) {
        if(!totalsearchspace[filterlist[i]].toLowerCase().includes(reqObj[filterlist[i]].toLowerCase())) {
          flag = false
        }
      }
      
      if(flag){
        arr.push(doc.data())
      }

      if(filterlist == []){
        arr.push(doc.data())
      }

    }
    catch(err) {
      console.log(err)
    }
   
  });

};

