var platesData = require('/home/ubuntu/Documents/keyboardapi/data/plates.json')
module.exports = {

	execute(router) {      
        router.get('/plates', function (req, res) {
			//console.log(req.query.id);
			getPlatesData(req,res)
		});
		router.post('/plates', function (req, res) {
			postPlatesData(req,res)
		});
	},
};

function searchManufacturerSize(term) {
    return platesData.plates.filter(({manufacturer, size}) => {
        return (manufacturer === term.manufacturer && size === term.size)

    })
}

function searchManufacturerMaterial(term) {
    return platesData.plates.filter(({manufacturer, material}) => {
        return (manufacturer === term.manufacturer && material === term.material)

    })
}

function searchSizeMaterial(term) {
    return platesData.plates.filter(({size, material}) => {
        return (material === term.material && size === term.size)

    })
}

function searchSizeMaterialManufacturer(term) {
    return platesData.plates.filter(({size, material, manufacturer}) => {
        return (material === term.material && size === term.size && manufacturer === term.manufacturer)

    })
}

function getPlatesData(req,res) {
    var data = {
        "plates": platesData.plates,
        "total": platesData.plates.length,
        "count": platesData.plates.length
    }
    var dataArray = [];

    if (req.query != undefined) {
        //ID
        if (req.query.id != null && Object.keys(req.query).length == 1) {
            data.plates.find(element => {
                if (element.id == req.query.id) {
                    dataArray.push(element)
                }
            })
        }

        //Size Material Manufacturer
        else if (
            req.query.size != null
            && req.query.material != null
            && req.query.manufacturer != null && Object.keys(req.query).length == 3) {

            let items = searchSizeMaterialManufacturer(req.query)
            for (var i = 0; i < items.length; i++) {
                dataArray.push(items[i])
            }
        }

        //Manufacturer Size
        else if (req.query.manufacturer != null && req.query.size != null
            && Object.keys(req.query).length == 2) {

            let items = searchManufacturerSize(req.query)
            for (var i = 0; i < items.length; i++) {
                dataArray.push(items[i])
            }
        }

        //Manufacturer and Material
        else if (req.query.manufacturer != null && req.query.material != null
            && Object.keys(req.query).length == 2) {

            let items = searchManufacturerMaterial(req.query)
            for (var i = 0; i < items.length; i++) {
                dataArray.push(items[i])
            }
        }

        //Size and Material
        else if (req.query.size != null && req.query.material != null
            && Object.keys(req.query).length == 2) {

            let items = searchSizeMaterial(req.query)
            for (var i = 0; i < items.length; i++) {
                dataArray.push(items[i])
            }
        }

        //Manufacturer
        else if (req.query.manufacturer != null && Object.keys(req.query).length == 1) {
            data.plates.find(element => {
                if (element.manufacturer === req.query.manufacturer) {
                    dataArray.push(element)
                }
            })

        }

        //Size
        else if (req.query.size != null && Object.keys(req.query).length == 1) {
            data.plates.find(element => {
                if (element.size === req.query.size) {
                    dataArray.push(element)
                }
            })

        }

        //Material
        else if (req.query.material != null && Object.keys(req.query).length == 1) {
            data.plates.find(element => {
                if (element.material === req.query.material) {
                    dataArray.push(element)
                }
            })

        }

        if (dataArray.length > 0) {
            var Obj = {
                "plates": dataArray,
                "total": platesData.plates.length,
                "count": dataArray.length
            }
			
			res.json(Obj);
			return;
        }
    }

    res.json(data);
	return;
}


function postPlatesData(req, res) {
    fs.readFile('./data/plates.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            const file = JSON.parse(data);
            for (var i = 0; i < file.plates.length; i++) {
                if (file.plates[i].id == req.body.id) {
                    console.log("ID already exist: " + req.body.id + " " + i);
                    return res.send("ID ALREADY EXIST");
                }
                if (file.plates[i].name == req.body.name && file.plates[i].material == req.body.material && file.plates[i].manufacturer == req.body.manufacturer) {
                    console.log("Plate already exist: " + file.plates[i]);
                    return res.send("ID ALREADY EXIST");
                }
            }

            file.plates.push(req.body)


            const json = JSON.stringify(file);

            fs.writeFile('./data/plates.json', json, 'utf8', function (err) {
                if (err) console.log(err);

            });
            return res.send("Plate Inputted");
        }

    });
}