# Using this code

## Environment variables

export

1. BUCKET_NAME : must exist and be in the region defined by
1. AWS_REGION : typically us-east-2
1. PUT_OBJECT_KEY : use the full prefix to the object. Define within double quotes
    1. export PUT_OBJECT_KEY="majesco/outbound/example_file.txt"

## Run the code

`node presigned-url-upload.js`

## Copy the presigned URL

Select and copy to the paste buffer the presigned URL associated with the `clientUrl` function.

Move to a terminal session that is **NOT** authenticated and export the URL

`export preClient="<paste>"`

## Upload the file

Use `curl` to upload the file

`curl -T <file> ${preClient}`

*note* filenames do not have to match
