## Test Base URL : https://admoni.herokuapp.com

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
fileObject
```
