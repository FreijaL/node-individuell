# Airbean API

http://localhost:6000

## SEE MENU
- GET /api/menu

## SIGNUP
- POST /api/signup
- JSON: { "username": "choise", "password": "choise", "role": "user OR admin" }

## LOGIN
- POST /api/login
- JSON: { "username": " ", "password": " uncrypt " }
- Can check in users.db-file for users or admins to test

## ADD PRODUCT
- POST /api/addproduct
- JSON: { "name": "strin", "price": number, "description": "string" }

## UPDATE PRODUCT
- PUT /api/updateproduct
- You have to insert right id for the product you want to update
- JSON: { "id": "16DPYPPlve95owr9", "whatToUpdate": "price OR name OR description", "updateTo": "30"  }

## DELETE PRODUCT
- DELETE /api/delete
- You need product id to delete a product
- JSON: { "id": "productIdHere" }

## CAMPAIGN
- POST /api/campaign
- { "products": "", "campaignPrice": number }
