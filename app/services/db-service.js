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

export const createTable = async () => {
  //debugger
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
      [],
      function (tx, res) {
        console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS table_user', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
            []
          );
        }
      }
    );
  })
  console.log('SQLite Database and Table Successfully Created...');
};

export const adddata = async () => {
 // debugger
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

export const getdata = async () => {
 // debugger
  db.transaction(function (tx) {
    tx.executeSql(
      'SELECT * FROM table_user',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
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