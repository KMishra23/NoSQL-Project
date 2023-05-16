import db from "../db/conn.mjs";

export const site_wise_cancer = [
    {
        "$match": {
            "cancer": 1
        }
    },
    {
        "$group": {
            "_id": "$site_id",
            "count": { "$sum": 1 }
        }
    }
]

export const site_wise_difficult_negatives = [
    {
        "$match": {
            "difficult_negative_case": 'True'
        }
    },
    {
        "$group": {
            "_id": "$site_id",
            "count": { "$sum": 1 }
        }
    }
]

export const all_cancer_entries = [
    {
        "$match": {
            "cancer": 1
        }
    },
    {
        "$group": {
            "_id": null,
            "count": { "$sum": 1 },
        }
    },
    {
        "$project": {
            "_id": 0,
            "count": 1,
        }
    }
]

export const age_wise_cancer_counts = [
    {
      "$match": {
        "cancer": 1,
        "age": { "$gte": 0 }
      }
    },
    {
      "$addFields": {
        "ageRange": {
          "$concat": [
            { "$toString": { "$subtract": [{ "$trunc": { "$divide": ["$age", 10] } }, 1] } },
            "0-",
            { "$toString": { "$trunc": { "$divide": ["$age", 10] } } },
            "0",
          ]
        }
      }
    },
    {
      "$group": {
        "_id": "$ageRange",
        "count": { "$sum": 1 }
      }
    },
    {
      "$sort": {
        "_id": 1
      }
    }
]

export const age_wise_cancer = [
    {
      "$match": {
        "age": { "$gte": 0 }
      }
    },
    {
      "$addFields": {
        "ageRange": {
          "$concat": [
            { "$toString": { "$subtract": [{ "$trunc": { "$divide": ["$age", 10] } }, 1] } },
            "0-",
            { "$toString": { "$trunc": { "$divide": ["$age", 10] } } },
            "0",
          ]
        }
      }
    },
    {
      "$group": {
        "_id": "$ageRange",
        "count": { "$sum": 1 }
      }
    },
    {
      "$sort": {
        "_id": 1
      }
    }
]
export function getStats(collection, columnName) {
  const column = "$" + columnName
  const columnCon = column + "Conv"
  const pipeline = [
    {
      "$addFields": {
        "ifNumbers": { "$regexMatch": {
          "input": column, "regex": /^[0-9]+$/
        } }
      }
    },
    {
      "$match": {
      "ifNumbers": true
      }
    },
    {
      "$project": {
        "ifNumbers": 0,
      }
    },
    {
      "$addFields": {
        columnCon: { $convert :{
          "input": column,
          "to": "double",
        }}
      }
    },
    {
      "$group": {
        "_id": null,
        "max": {
          "$max": "$columnCon"
        },
        "min": {
          "$min": "$columnCon"
        },
        "mean": {
          "$avg": "$columnCon"
        },
        "std-dev": {
          "$stdDevSamp": "$columnCon"
        }
      }
    },
    {
      "$project": {
        "_id": 0,
      }
    }
  ]


  return pipeline
}