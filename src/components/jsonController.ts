// import { MainBundlePath, readDir, readFile, stat } from "react-native-fs";
// export function changeJsonData() {
//     readDir(MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
//         .then((result) => {
//             console.log('GOT RESULT', result);

//             // stat the first file
//             return Promise.all([stat(result[0].path), result[0].path]);
//         })
//         .then((statResult) => {
//             if (statResult[0].isFile()) {
//                 // if we have a file, read it
//                 return readFile(statResult[1], 'utf8');
//             }

//             return 'no file';
//         })
//         .then((contents) => {
//             // log the file contents
//             console.log(contents);
//         })
//         .catch((err) => {
//             console.log(err.message, err.code);
//         });
//     // const newTable = table.Sheet1.map((word: any) => {
//     //     return {
//     //         word: word.a,
//     //         translation: word.b,
//     //         frequency: 1
//     //     }
//     // })
//     // console.log(newTable);
// }