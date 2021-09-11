import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ToDoItem } from '../models';

// enablePromise(true);
var db = openDatabase({
  name: 'SchoolDatabase.db',
  location: 'default'
},
  () => {
    console.log("algo")
  }, (error) => {
    console.error(error);
  });

export const createTableExperimento = async () => {
  //debugger
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_Experimento'",
      [],
      function (tx, res) {
        if (res.rows.length != 0) {
          txn.executeSql('DROP TABLE IF EXISTS table_Experimento', []);
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS table_Experimento(Expe_id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "Expe_name VARCHAR(50))",
            []
          );
        }
      }
    );
  })
  console.log('SQLite Database and table_Experimento Successfully Created..');
};

export const createTableDivice = async () => {
  //debugger
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_Divice'",
      [],
      function (tx, res) {
        if (res.rows.length != 0) {
          txn.executeSql('DROP TABLE IF EXISTS table_Divice', []);
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS table_Divice(TableDivi_id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "Expe_id INTEGER, Macaddres VARCHAR(23), serviceuuid VARCHAR(255), caracteristica VARCHAR(255)," +
            " FOREIGN KEY(Expe_id) REFERENCES table_Experimento(Expe_id))",
            []
          );
        }
      }
    );
  })
  console.log('SQLite Database and table_Divice Successfully Created...');
};

export const createTableData = async () => {
  //debugger
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_Data'",
      [],
      function (tx, res) {
        if (res.rows.length != 0) {
          txn.executeSql('DROP TABLE IF EXISTS table_Data', []);
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS table_Data(TableData_id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "Expe_id INTEGER, TableDivi_id INTEGER, Data text, " +
            "FOREIGN KEY(Expe_id) REFERENCES table_Experimento(Expe_id)" +
            "FOREIGN KEY(TableDivi_id) REFERENCES table_Divice(TableDivi_id))",
            []
          );
        }
      }
    );
  })
  console.log('SQLite Database and table_Divice Successfully Created...');
};

export const adddataExperimento = async (Expe_name) => {
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO table_Experimento (Expe_id, Expe_name) VALUES (?,?)',
      [, Expe_name],
      (tx, results) => {
        console.log('Results', results);
        if (results.rowsAffected > 0) {
          console.log("evento registrado")
        } else alert('Registration Failed');
      }
    );
  });
};

export const addDivice = async (Divice) => {
  debugger
  let indice
  getindice(value => {
    console.log(value)
    indice=value[0]
  })
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO table_Divice (TableDivi_id, Expe_id, Macaddres, serviceuuid, caracteristica) VALUES (?,?,?,?,?)',
      [, indice, Divice.getMacaddres(), Divice.getserviceuuids(), Divice.getcaracteristica()],
      (tx, results) => {
        console.log('Results', results);
        if (results.rowsAffected > 0) {
          console.log("evento registrado inset en table_Experimento")
        } else alert('Registration Failed');
      }, function (tx, error) {
        reject(error);
      });
  });
};

export const adddata = async () => {
  //debugger
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO table_user (user_name, user_contact, user_address) VALUES (?,?,?)',
      ["userName", "userContact", "userAddress"],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log("evento registrado")
        } else alert('Registration Failed');
      }
    );
  });
};

const getindice = (callback) => {
  db.transaction((tx) => {
    query = "SELECT MAX(Expe_id) as id FROM table_Experimento";
    tx.executeSql(query,
      [], (tx, results) => {
        console.log("\n\nQuery completed\n");
        var resultItemIdArr = new Array();
        for (let i = 0; i < results.rows.length; i++) {
          resultItemIdArr.push(results.rows.item(i).id);
          console.log(results.rows.item(i).id);
        }
        callback(resultItemIdArr);
      });
  });
};

export const getdata = async () => {
  db.transaction(function (tx) {
    tx.executeSql(
      'SELECT MAX(Expe_id) FROM table_Experimento',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        console.log(results.rows.item(i))
        //temp.push();
        // setItems(temp);

        // if (results.rows.length >= 1) {
        //   setEmpty(false);
        // } else {
        //   setEmpty(true)
        // }

      }
    );
  });
};

const deleteRecord = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM Student_Table where student_id=?',
      [S_Id],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Done',
            'Record Deleted Successfully',
            [
              {
                text: 'Ok',
                onPress: () => navigation.navigate('ViewAllStudentScreen'),
              },
            ],
            { cancelable: false }
          );
        }
      }
    );
  });

}



// export const getDBConnection = async () => {
//   return openDatabase({ name: 'todo-data.db', location: 'default' });
// };

// export const createTable = async (db: SQLiteDatabase) => {
//   // create table if not exists
//   const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
//         value TEXT NOT NULL
//     );`;

//   await db.executeSql(query);
// };

// export const getTodoItems = async (db: SQLiteDatabase): Promise<ToDoItem[]> => {
//   try {
//     const todoItems: ToDoItem[] = [];
//     const results = await db.executeSql(`SELECT rowid as id,value FROM ${tableName}`);
//     results.forEach(result => {
//       for (let index = 0; index < result.rows.length; index++) {
//         todoItems.push(result.rows.item(index))
//       }
//     });
//     return todoItems;
//   } catch (error) {
//     console.error(error);
//     throw Error('Failed to get todoItems !!!');
//   }
// };

// export const saveTodoItems = async (db: SQLiteDatabase, todoItems: ToDoItem[]) => {
//   const insertQuery =
//     `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
//     todoItems.map(i => `(${i.id}, '${i.value}')`).join(',');

//   return db.executeSql(insertQuery);
// };

// export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
//   const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
//   await db.executeSql(deleteQuery);
// };

// export const deleteTable = async (db: SQLiteDatabase) => {
//   const query = `drop table ${tableName}`;

//   await db.executeSql(query);
// };