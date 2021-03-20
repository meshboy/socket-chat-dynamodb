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
  "status": true,
    "data": {
        "id": "08164663352",
        "timeCreated": 1616063749959,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA4MTY0NjYzMzUyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2MTYwOTEyNjl9.S2srOnvBiPRJjI5ojEdYJj9rA5lSKoaxfCczYbTaxwc"
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


## send chat 

__Event Name__ 
`chatMessage`

__Event PayLoad__

```javascript
{
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZha2VVc2VySWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTYxNjI2NjkyMH0.f2vzMfOLNAwH4I8AUSQ-TrU-1ykmvyhfOv2SWhTfZdc',
  message: 'hello Admoni bobo',
  senderUsername: 'sender john',
  recipientUsername: 'receiver mike',
  messageType: 'TEXT',
  recipientId: 'fakeRecipient',
  timeCreated: 1616266920605
}
```

## Receive chat 

__Event Name__
`senderId:recipientId`

__Event PayLoad__
```javascript
{
  message: 'hello Admoni bobo',
  senderUsername: 'sender john',
  recipientUsername: 'receiver mike',
  messageType: 'TEXT',
  recipientId: 'fakeRecipient',
  timeCreated: 1616267123089
}

```


## Error Listener

__Event Name__
errorMessage

__unauthorised error__
```javascript
{"status":false,"message":"UN_AUTHORISED"}
```
