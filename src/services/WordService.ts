import { Service } from "typedi";
import fs from "fs";
import Word from "models/Word";


const fileName = "dictionary/anhviet109K.txt";

@Service()
export default class WordService {
    constructor(
        // private wordRepository: WordRepository,
    ) { }

    public async loadDictionary() {
        const data = fs.readFileSync(fileName, 'utf8').toString().replace(/\r\n/g, '\n').split('\n');
        let database = []

        let word = {
            word: '',
            phonetic: "",
            meaning: "",
            audios: ""
        }

        const promises = data.map((value, index) => {
            let line = data[index];

            if (line[0] === "@") {
                let foneticIndexStart = -1;
                let foneticIndexEnd = -1;
                for (var char of line) {
                    if (char === "/") {
                        foneticIndexStart = line.indexOf("/");
                        break;
                    }
                }

                for (var i = foneticIndexStart + 1; i < line.length; i++) {
                    if (line[i] === "/") {
                        foneticIndexEnd = i;
                        break;
                    }
                }

                word.word = line.split(" ")[0].substring(1);

                if (foneticIndexStart !== -1 && foneticIndexEnd !== -1) {
                    word.word = line.substring(1, foneticIndexStart - 1);
                    word.phonetic = line.substring(foneticIndexStart + 1, foneticIndexEnd);
                }

                // console.log(word);
            }
            else if (line[0] === "*" || line[0] === "-" || line[0] === "=") {
                word.meaning = word.meaning.concat(line);
                word.meaning = word.meaning.concat("<br>");
            }

            if (index > data.length - 2) {
                console.log("noting")
            }
            else if (data[index + 1] == "" || (data[index + 1] !== undefined && data[index + 1][0] === "@")) {
                if (word.word) {
                    database.push(word);
                    word = {
                        word: '',
                        phonetic: "",
                        meaning: "",
                        audios: ""
                    }
                }
            }
        })

        await Promise.all(promises)
        return database;
    }

    // public async createDictionary() {
    //     const database = await this.loadDictionary();
    //     console.log(database)
    //     console.log("done")
    //     const newArr1 = database.slice(0, 1000);
    //     const newArr2 = database.slice(1000, 2000);
    //     const newArr3 = database.slice(2000, 3000);
    //     const newArr4 = database.slice(3000, 4000);
    //     const newArr5 = database.slice(4000, 5000);
    //     const newArr6 = database.slice(5000, 6000);
    //     const newArr7 = database.slice(6000, 7000);
    //     const newArr8 = database.slice(7000, 8000);
    //     const newArr9 = database.slice(8000, 9000);
    //     const newArr10 = database.slice(9000, 10000);
    //     const newArr11 = database.slice(10000, 11000);
    //     const newArr12 = database.slice(11000, 12000);
    //     const newArr13 = database.slice(12000, 22000);
    //     const newArr14 = database.slice(22000, 32000);
    //     const newArr15 = database.slice(32000, 42000);
    //     const newArr16 = database.slice(42000, 52000);
    //     const newArr17 = database.slice(52000, 62000);
    //     const newArr18 = database.slice(62000, 72000);
    //     const newArr19 = database.slice(72000, 82000);
    //     const newArr20 = database.slice(82000, 92000);
    //     const newArr21 = database.slice(92000, 100000);
    //     const newArr22 = database.slice(100000, database.length);

    //     for (let i = 1; i < 23; i++) {
    //         const arrName = `newArr${i}`;
    //         const arr = eval(arrName);
    //         Word.bulkCreate(arr, {validate: true}).then(() => {
    //             console.log("Create dictionary successfully");
    //         }).catch(err => {
    //             console.log(err);
    //         })
    //     }
       
    // }

    // public async getWordByName(name: string) {
    //     const word = await this.wordRepository.findByName(name);

    //     if (!word) throw new NotFoundError("Word not found");

    //     return word;
    // }
}