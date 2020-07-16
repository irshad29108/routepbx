const mongoose = require("mongoose");
const Campaign = mongoose.model("Campaign");
const Tfn = mongoose.model("Tfn");
const CampPubTfn = mongoose.model("Camp_Pub_Tfn");
const CampBuyerTfn = mongoose.model("Camp_Buyer_Tfn");
var campaign = {};

campaign.addCampaign = async (req, res, next) => {
  
  let r = Math.random().toString(36).substring(7);
 // console.log(req.body);
  /* Adding the new Campaign */
  let campaign = new Campaign();
  campaign.pub_id = req.body.pub_id;
  campaign.camp_name = req.body.camp_name + r;
  campaign.buffer_time = req.body.buffer_time || 0;
  campaign.price_per_call = req.body.price_per_call || 0;
  campaign.time_zone = req.body.time_zone;
  campaign.read_only = req.body.read_only;
  campaign.created_at = Date.now();
  campaign.inside_route = req.body.inside_route || "";
  campaign
    .save()
    .then(data => {
      if (!data) {
        return res.sendStatus(422);
      }
      let queue_no = 0;
      let queue_name = "";
	  /*if inside route*/
      if (req.body.inside_route != undefined && req.body.inside_route !== "") {
        queue_no = req.body.inside_route;
        queue_name = "Queue";
        let campbuyertfn = new CampBuyerTfn();
        campbuyertfn.camp_id = data.campaign_id;
        campbuyertfn.buyer_id = req.body.buyer_id;
        campbuyertfn.buyers_no = queue_no;
        campbuyertfn.priority = 0;
        campbuyertfn.capping = 0;
        campbuyertfn.global_cap = 0;
        campbuyertfn.status = 'on';
        campbuyertfn.pause_status = 'pause';
        campbuyertfn.queue = queue_no;
        campbuyertfn.created_at = Date.now();
        campbuyertfn
          .save()
          .then(async data5 => {
            if (!data5) {
            //  return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
            }
            console.log("campbuyertfn inside",data5);
            
		  
          })
          .catch(next);

		req.body.tfns.forEach((tfn, index) => {
			  console.log(tfn);
			  let camp_pub_tfn = new CampPubTfn();
              camp_pub_tfn.camp_id = data.campaign_id;
              camp_pub_tfn.pub_id = data.pub_id;
              camp_pub_tfn.tfn = tfn;
              camp_pub_tfn.queue = queue_no;
              camp_pub_tfn.created_at = Date.now();
              camp_pub_tfn.save().then(data4 => {
				  console.log("camppubtfn inside");
                if (!data4) {
                  return res.sendStatus(422);
                }
              })
                .catch(next);
        
      });
      /* udpating the campaign */
		  const options = {
			new: false,
			upsert: false
		  };

		  Campaign.findOneAndUpdate({
			campaign_id: data.campaign_id
		  }, {
			  queue_name: queue_name,
			  queue_no: queue_no
			},
			options
		  ).then(data6 => {
			if (!data6) {
			//  return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
			}
			let source = {queue_no: queue_no, queue_name: queue_name}
			let returnedTarget = Object.assign(data6, source);
			console.log("campaign inside");
			return res.json({
			  statusCode: "200",
			  status: 'success',
			  message: 'Add Campaign',
			  data: returnedTarget
			});
		  }).catch(next);
      } else {
		  /* if not inside route*/
        queue_no = "55000" + data.campaign_id;
       
		  queue_name = data.camp_name.replace(" ", "") + data.campaign_id + req.body.pub_id;
        if (req.body.buyer_numbers) {
           
            req.body.buyer_numbers.forEach((bn, index) => {
			console.log(bn);
            let campbuyertfn = new CampBuyerTfn();
            campbuyertfn.camp_id = data.campaign_id;
            campbuyertfn.buyer_id = bn.buyer_id;
            campbuyertfn.buyers_no = bn.buyer_number;
            campbuyertfn.priority = bn.priority;
            campbuyertfn.capping = bn.capping;
            campbuyertfn.global_cap = bn.global_cap || 0;
            campbuyertfn.status = bn.status || 'on';
            campbuyertfn.pause_status = bn.pause_status || 'pause';
            campbuyertfn.queue = queue_no;
            campbuyertfn.created_at = Date.now();
            campbuyertfn.save().then(async data5 => {
              if (!data5) {
                //return res.sendStatus(422);
				return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
              }
              console.log("campaign outside",data5);
              
            })
              .catch(next);
          });

        }
		
		
		req.body.tfns.forEach((tfn, index) => {
        let camp_pub_tfn = new CampPubTfn();
              camp_pub_tfn.camp_id = data.campaign_id;
              camp_pub_tfn.pub_id = data.pub_id;
              camp_pub_tfn.tfn = tfn;
              camp_pub_tfn.queue = queue_no;
              camp_pub_tfn.created_at = Date.now();
              camp_pub_tfn.save().then(data4 => {
				  console.log("campaign outside");
                if (!data4) {
                  return res.sendStatus(422);
                }
              })
                .catch(next);
        
      });
      /* udpating the campaign */
      const options = {
        new: false,
        upsert: false
      };

      Campaign.findOneAndUpdate({
        campaign_id: data.campaign_id
      }, {
          queue_name: queue_name,
          queue_no: queue_no
        },
        options
      ).then(data6 => {
        if (!data6) {
        //  return res.sendStatus(422);
		return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
        }
		let source = {queue_no: queue_no, queue_name: queue_name}
		let returnedTarget = Object.assign(data6, source);
        console.log("campaign outside");
        return res.json({
          statusCode: "200",
		  status: 'success',
		  message: 'Add Campaign',
		  data: returnedTarget
        });
      }).catch(next);
		
		
		
      }

    }).catch(next);
};

campaign.getAllCampaign = (req, res, next) => {
	let query = {};
	if(req.params.campaignId){
		query = {
			campaign_id: parseInt(req.params.campaignId),
			pub_id: {
				$ne: 0
			}
		}
	}
	else{
		query = {
			pub_id: {
				$ne: 0
			}
		};
	}
	let aggregateData = [{
		$match: query
	},
	{
		$lookup: {
			from: "camp_buyer_tfns",
			localField: "campaign_id",
			foreignField: "camp_id",
			as: "buyerdata"
		}
	},
	/*{ 
		 $unwind:"$buyerdata"
    },*/
	{
		$lookup: {
			from: "users",
			localField: "pub_id",
			foreignField: "uid",
			as: "userdata"
		}
	},
	/*{ 
		 $unwind:"$userdata"
    },*/
	{
		$lookup: {
			from: "camp_pub_tfns",
			localField: "campaign_id",
			foreignField: "camp_id",
			as: "tfndata"
		}
	},
	/*{ 
		 $unwind:"$userdata"
    },*/
	{
		$project: {
			campaign_id: 1,
			pub_id: 1,
			camp_name: 1,
			buffer_time: 1,
			price_per_call: 1,
			created_at: 1,
			status: 1,
			time_zone: 1,
			queue_name: 1,
			inside_route: 1,
			queue_no: 1,
			read_only: 1,
			publisherName: "$userdata.fullname",
			buyer_id: "$buyerdata.buyer_id",
			tfn: "$tfndata"
			
		}
	}
	
	];
	Campaign.aggregate(aggregateData)
	.then(data => {
		if(!data){
			//return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
		}
		return res.json({
			//success: "OK",
			statusCode: "200",
			status: 'success',
			message: 'Get All Campaign',	
			campaigns: data
		});
	})
	.catch(next);
}
campaign.deleteCampaign = (req, res, next) => {
	
	function updateTfns(tfn, pub_id){
		const options = {
			new: false,
			upsert: false
		};
		const query = {
			tfn: tfn,
			pub_id: pub_id
		};
		Tfn.findOneAndUpdate(query, {
			status: "available"
		}, options).then(data2 => {
			console.log("TFN updated successfully");
		}).catch(next);
		
	}
	
	
	Campaign.findOne({
		campaign_id: req.params.campId
	}).then(campaign => {
		let q = campaign.queue_no;
		if(campaign.inside_route !== ''){
			q = '55000'+req.params.campId;
			
		}
		
		CampPubTfn.find({
			camp_id: campaign.campaign_id
		}).then(pub_tfns => {
			console.log(pub_tfns);
			pub_tfns.forEach(async p => {
				//update tfns as unused
				console.log('delete',p,req.body.pub_id);
				await updateTfns(p.tfn, p.pub_id);
			})
		}).catch(next);
		
		
		CampBuyerTfn.deleteMany({
			camp_id: campaign.camp_id
		}).then(data => {
			console.log();
		}).catch(next);
		
		
		Campaign.deleteOne({
		  campaign_id: req.params.campId
		})
		  .then(data => {
			if (!data) {
			//  return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
			}
			return res.json({
			  //success: "OK",
			  //message: "Campaign is deleted successfully"
			   statusCode: "200",
				status: 'success',
				message: 'Campaign is deleted successfully',
			});
		  }).catch(next);
			
		
	}).catch(next);
}

campaign.editCampaign = async (req, res, next) => {
  function oldTfns(tfn, pub_id) {
    const query = {
      tfn: tfn,
      pub_id: pub_id
    };
    Tfn.findOneAndUpdate(query, {
      status: "used"
    }, options).then(data2 => {
      console.log("update1 tfn unused");
    })
      .catch(next);
   
  }
	
	function updateTfns(tfn, pub_id){
		const options = {
			new: false,
			upsert: false
		};
		const query = {
			tfn: tfn,
			pub_id: pub_id
		};
		Tfn.findOneAndUpdate(query, {
			status: "available"
		}, options).then(data2 => {
			console.log("TFN updated successfully");
		}).catch(next);
		
	}
	function updateCampTfn(tfnn, camp_id){
		CampPubTfn.deleteMany({
			camp_id: camp_id,
			tfn: tfnn
		}).then(data => {
			console.log();
		}).catch(next);
			
	}
  let r = Math.random().toString(36).substring(7);
  /* Adding the new Campaign */
  let campaign = {
    pub_id: req.body.pub_id,
    //camp_name: req.body.camp_name+r,
    camp_name: req.body.camp_name,
    buffer_time: req.body.buffer_time || 0,
    price_per_call: req.body.price_per_call || 0,
    time_zone: req.body.time_zone,
    read_only: req.body.read_only,
    inside_route: req.body.inside_route || "",
  };

  /* udpating the campaign */
  const options = {
    new: false,
    upsert: false
  };
const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item
		 return obj
		 console.log(obj);
		
	})
  Campaign.findOneAndUpdate({
    campaign_id: req.params.campaignId
  },
    campaign,
    options
  ).then(data => {
    if (!data) {
    //  return res.sendStatus(422);
	return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
    }

    console.log(data.campaign_id);
    let queue_no = 0;
    let queue_name = "";
    CampBuyerTfn.deleteMany({
      camp_id: data.campaign_id
    })
      .then(data2 => {
        if (data2.ok) {
			CampPubTfn.find({
				camp_id: req.params.campaignId
			}).then(pub_tfns => {
				pub_tfns.forEach(async p => {
					//update tfns as unused
					console.log('p'+p);
					await updateTfns(p.tfn, p.pub_id);
					await updateCampTfn(p.tfn, p.camp_id);
				})
			}).catch(next);
			//console.log(req.body);
          if (req.body.inside_route != undefined && req.body.inside_route !== "") {
            //queue_no = req.body.inside_route;
            queue_no = 0;
            queue_name = "Queue";
            let campbuyertfn = new CampBuyerTfn();
            campbuyertfn.camp_id = data.campaign_id;
            campbuyertfn.buyer_id = 1;
            campbuyertfn.buyers_no = queue_no;
            campbuyertfn.priority = 0;
            campbuyertfn.capping = 0;
            campbuyertfn.global_cap = 0;
            campbuyertfn.status = 'on';
            campbuyertfn.pause_status = 'pause';
            campbuyertfn.queue = queue_no;
            campbuyertfn.created_at = Date.now();
            campbuyertfn
              .save()
              .then(data5 => {
                if (!data5) {
                  return res.sendStatus(422);
                }
                console.log("add buyer camp record with inside route");
				return res.json({ success: "OK", data: data5 });
              })
              .catch(next);
          } else {
            queue_no = "55000" + data.campaign_id;
            queue_name =
              data.campaign_id +
              "_" +
              req.body.pub_id +
              "_" +
              data.camp_name.replace(" ", "");
            if (req.body.buyer_numbers) {
			  
              req.body.buyer_numbers.forEach((bn, index) => {
                let campbuyertfn = new CampBuyerTfn();
                campbuyertfn.camp_id = data.campaign_id;
                campbuyertfn.buyer_id = bn.buyer_id;
                campbuyertfn.buyers_no = bn.buyer_number;
                campbuyertfn.capping = bn.capping;
                campbuyertfn.priority = bn.priority;
                campbuyertfn.global_cap = bn.global_cap || 0;
                campbuyertfn.status = bn.status || 'on';
                campbuyertfn.pause_status = bn.pause_status || 'pause';
                campbuyertfn.queue = queue_no;
                //campbuyertfn.queue_name = queue_name;
                campbuyertfn.created_at = Date.now();
                //console.log(campbuyertfn);
                campbuyertfn
                  .save()
                  .then(data5 => {
                    if (!data5) {
                     // return res.sendStatus(422);
					 return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
                    }
					return res.json({
						//success: "OK",
						statusCode: "200",
						status: 'success',
						message: 'Edit Campaign',
						inside_route:req.body.inside_route || "",	
						buyer_numbers: data5,
						queue_no: queue_no,
						queue_name: queue_name,
						tfns: req.body.tfns,
						data: data2
					  });
                    console.log("add the record in the camp buyer");
                  })
                  .catch(next);
              });
              
              /*return res.json({
                //success: "OK",
				statusCode: "200",
				status: 'success',
				message: 'Edit Campaign',
				inside_route:req.body.inside_route || "",	
				buyer_numbers: req.body.buyer_numbers,
				tfns: req.body.tfns,
				data: data2
              });*/
            }
          }
        }
      })
      .catch(next);

    /* TFN(s) */

    req.body.tfns.forEach((tfn, index) => {
         CampPubTfn.deleteMany({
          camp_id: data.campaign_id,
          tfn: tfn
        }).then(async data3 => {
     
		await oldTfns(tfn, req.body.pub_id);
          const query = {
            tfn: tfn,
            pub_id: req.body.pub_id
          };
          const options = {
            upsert: false,
            new: false,
            overwrite: false
          };
          /* updating the tfn collection for specific publisher and adding data in camp_pub_tfn collection */
          Tfn.findOneAndUpdate(
            query, {
              pub_id: req.body.pub_id,
              status: "used"
            },
            options
          )
            .then(data2 => {
              if (data2) {
                if (queue_no === 0) {
                  queue_no = req.body.inside_route || 0;
                }
              
                let camp_pub_tfn = new CampPubTfn();
                camp_pub_tfn.camp_id = data.campaign_id;
                camp_pub_tfn.pub_id = data.pub_id;
                camp_pub_tfn.tfn = tfn;
                camp_pub_tfn.queue = queue_no;
				//campbuyertfn.queue_no = queue_no;
                //campbuyertfn.queue_name = queue_name;
                camp_pub_tfn.created_at = Date.now();
                camp_pub_tfn
                  .save()
                  .then(data4 => {
                    if (!data4) {
                    //  return res.sendStatus(422);
                    return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
					}
                  })
                  .catch(next);
               console.log('status used');
              
              }
            })
            .catch(next);
        });

    });
  }).catch(next);
};
/*campaign.getCampaign = (req, res, next) => {
	let query = {};
	if(req.params.campaignId){
		query = {
			campaign_id: parseInt(req.params.campaignId),
			pub_id: {
				$ne: 0
			}
		};
	}else{
		query = {
			pub_id: {
				$ne: 0
			}
		};
	}
	let aggregateData = [{
		$match: query
	},
	{
		$lookup: {
			from: "users",
			localField: "pub_id",
			foreignField: "uid",
			as: "userdata"
		}
	},
	{
		$project: {
			campaign_id: 1,
			pub_id: 1,
			camp_name: 1,
			buffer_time: 1,
			price_per_call: 1,
			created_at: 1,
			status: 1,
			time_zone: 1,
			queue_name: 1,
			queue_no: 1,
			inside_route:1,
			read_only: 1,
			publisherName: {
				$arrayElemAt: ["$userdata: fullname", 0]
			}
		}
	}
	];
	
	const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item
		 return obj
		 console.log(obj);
		
	})
	Campaign.aggregate(aggregateData).then(data => {
		if(!data){
			//return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'No Campaign Found'})
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Campaign Detail',
			campaigns: arrayToObject(data)
		});
	}).catch(next);
};*/
campaign.getCampaign = (req, res, next) => {
	let query = {};
	if(req.params.campaignId){
		query = {
			campaign_id: parseInt(req.params.campaignId),
			pub_id: {
				$ne: 0
			}
		};
	}else{
		query = {
			pub_id: {
				$ne: 0
			}
		};
	}
	let aggregateData = [{
		$match: query
	},
	{
		$lookup: {
			from: "users",
			localField: "pub_id",
			foreignField: "uid",
			as: "userdata"
		}
	},
	{ 
		 $unwind:"$userdata"
    },
	{
		$lookup: {
			from: "camp_buyer_tfns",
			localField: "campaign_id",
			foreignField: "camp_id",
			as: "buyerdata"
		}
	},
	/*{ 
		 $unwind:"$buyerdata"
    },*/
	{
		$lookup: {
			from: "camp_pub_tfns",
			localField: "campaign_id",
			foreignField: "camp_id",
			as: "tfndata"
		}
	},
	{
		$project: {
			campaign_id: 1,
			pub_id: 1,
			camp_name: 1,
			buffer_time: 1,
			price_per_call: 1,
			created_at: 1,
			status: 1,
			time_zone: 1,
			queue_name: 1,
			queue_no: 1,
			inside_route:1,
			read_only: 1,
			publisherName: "$userdata.fullname",
			//buyerName: "$buyerdata.name",
			buyer_id: "$buyerdata.buyer_id",
			buyer_no: "$buyerdata",
			tfn: "$tfndata.tfn"

		}
	}
	];
	
	/*const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item
		 return obj;
		
	})*/
	Campaign.aggregate(aggregateData).then(data => {
		if(!data){
			//return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'No Campaign Found'})
		}
		console.log(data);
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Campaign Detail',
			campaigns: data //arrayToObject(data)
		});
	}).catch(next);
};
campaign.getCampBuyerTfns = (req, res, next) => {
	
  CampBuyerTfn.find({
    camp_id: req.params.camp_id
  })
    .then(data => {
      if (!data) {
        return res.sendStatus(422);
      }
      return res.json({
	    statusCode: "200",
		status: 'success',
		message: 'Campaign Detail',
        buyer_tfns: data
      });
    })
    .catch(next);
};
campaign.getCampPubTfns = (req, res, next) => {
  
  CampPubTfn.find({
    camp_id: req.params.camp_id
  })
    .then(data => {
      if (!data) {
        return res.sendStatus(422);
      }
      return res.json({
		statusCode: "200",
		status: 'success',
		message: 'Campaign Detail',
        camp_tfns: data
      });
    })
    .catch(next);
};
module.exports = campaign;