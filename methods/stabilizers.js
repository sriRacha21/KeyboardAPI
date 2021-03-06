var stabilizersData = require('/home/ubuntu/Documents/keyboardapi/data/stabilizers.json')
module.exports = {

	execute(router) {      
        router.get('/stabilizers', function (req, res) {
			//console.log(req.query.id);
			getStabilizerData(req,res)
        });
        router.get('/stabilizers/:id(\\d+)/', function (req, res) {
            req.query = req.params;
            getStabilizerData(req, res);

        });
        router.get('/stabilizers/:manufacturer(KBDFans|1UPKeyboards|NovelKeys)', function (req, res) {
            req.query = req.params;
            getStabilizerData(req, res);

        });
        router.get('/stabilizers/:mounttype(both|pcb|plate)', function (req, res) {
            req.query = req.params;
            getStabilizerData(req, res);

        });
        
        router.get('/stabilizers/:null', function (req, res) {
            var data = {
                "status": "error",
                "msg": "none found",
                "total": stabilizersData.stabilizers.length,
                "count": 0
            }
            res.json(data);
            
        });
	},
};


function getStabilizerData(req,res) {
    var data = {
        "stabilizers": stabilizersData.stabilizers,
        "total": stabilizersData.stabilizers.length,
        "count": stabilizersData.stabilizers.length
    }
    var dataArray = [];

    if (req.query != undefined) {
        //
        if (req.query.id != null && Object.keys(req.query).length == 1) {
            data.stabilizers.find(element => {
                if (element.id == req.query.id) {
                    dataArray.push(element)
                }
            })
        }
        //Manufacturer
        else if (req.query.manufacturer != null && Object.keys(req.query).length == 1) {
            data.stabilizers.find(element => {
                if (element.manufacturer === req.query.manufacturer) {
                    dataArray.push(element)
                }
            })

        } 
        //Color
        else if (req.query.color != null && Object.keys(req.query).length == 1) {
            data.stabilizers.find(element => {
                if (element.color === req.query.color) {
                    dataArray.push(element)
                }
            })

        }

        if (dataArray.length > 0) {
            var Obj = {
                "stabilizers": dataArray,
                "total": stabilizersData.stabilizers.length,
                "count": dataArray.length
            }
			res.json(Obj);
			return;
        }
    }

	res.json(data);
	return;
}