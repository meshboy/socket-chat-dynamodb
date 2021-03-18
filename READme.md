## Test Base URL : https://admoni.herokuapp.com

### Authentication: Basic Auth

**username: xxxx Password: xxx**

`Upload File`

`POST /file/upload`

**Request**

```javascript
formData {
  media: fileObject
}
```

**Response**

```javascript
{
    "status": true,
    "data": {
        "id": "604cf103886256679bf2cb97"
    }
}
```

`Fetch File by id`

`GET /file/:id`

**Response**

```javascript
fileObject;
```

`Add new account to server`

#### please note: a user that wants to use admoni needs to be added to the db

`POST /user`

_Request_

```javascript
{
    "id": "08164663352"
}
```

_Response_

```javascript
{
    "status": true,
    "data": {
        "id": "08164663352",
        "timeCreated": 1616063749959,
        "timeUpdated": 1616063749959
    }
}
```

`Validate if id is on admoni server`

`POST /user/validate`

_Request_

```javascript
[
  {
    id: "08164663352",
  },
  {
    id: "08164663357",
  },
];
```

_Response_

```javascript
{
    "status": true,
    "data": [
        {
            "id": "08164663352",
            "isAvailable": true
        },
        {
            "id": "08164663357",
            "isAvailable": false
        }
    ]
}
```
