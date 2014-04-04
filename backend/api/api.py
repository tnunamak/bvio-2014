import json, web, requests

urls = (
    '/data/reviews.json(.*)', 'Reviews',
    '/data/author_reviews.json(.*)', 'AuthorReviews'
)

class DevApi:
    base_url="http://api.bazaarvoice.com"
    passkey="i03leyw1b6403qjgmi8zg4jy2"

    def get_reviews(self, productId, limit="10", offset="0"):

        path="/data/reviews.json?apiversion=5.4&passkey=" + self.passkey + "&Filter=ProductId:" + productId + "&Include=Products&Stats=Reviews&Limit=" + limit + "&Offset=" + offset

        response = requests.get(url=self.base_url + path)

        return json.loads(response.content)

    def get_reviews_by_author(self, productId, authorId):
        path="/data/reviews.json?apiversion=5.4&passkey=" + self.passkey + "&Filter=ProductId:" + productId + "&Filter=AuthorId:" + authorId + "&Include=Products&Stats=Reviews"


        response = requests.get(url=self.base_url + path)

        return json.loads(response.content)

    def get_other_reviews_by_author(self, product_id, author_id):
        path="/data/reviews.json?apiversion=5.4&passkey=" + self.passkey + "&Include=Products&Filter=AuthorId:" + author_id + "&Stats=Reviews"

        response = requests.get(url=self.base_url + path)

        response_object = json.loads(response.content)

        scraped_reviews = []
        products = response_object.get("Includes", {}).get("Products", {})
        for review in response_object.get("Results", []):
            review_product_id = review.get("ProductId", "")
            if review_product_id != product_id:
                product_object = products.get(review_product_id, None)
                if product_object:
                    product_url = product_object.get("ProductPageUrl", None)
                    if product_url:
                        review["ProductPageUrl"] = product_url
                scraped_reviews.append(review)

        return scraped_reviews

    def get_review(self, review_id):
        path="/data/reviews.json?apiversion=5.4&passkey=" + self.passkey + "&Filter=Id:" + review_id + "&Stats=Reviews"


        response = requests.get(url=self.base_url + path)

        response_object = json.loads(response.content)

        if not response_object.get("HasErrors", True):
            return response_object.get("Results")[0]

        return []

class AuthorId:
    def __init__(self):
        self.author_product_id_map = {}
        user_map = {}
        user_map['Irmooc'] = "1559146239"
        user_map['elle7373'] = "1803040468"
        user_map['zssofi'] = "4567057532"
        user_map['Bourdoisea'] = "3541633980"
        self.author_product_id_map['342649'] = user_map
        self.author_product_id_map['711113'] = user_map
        self.author_product_id_map['303327'] = user_map

    def get_author_id(self, product_id, friend):
        author_map = self.author_product_id_map.get(product_id, None)
        if author_map:
            return author_map.get(friend, None)
        return None

class Reviews:
    dev_api = DevApi()

    def __init__(self):
        self.author_product_id_map = {}
        user_map = {}
        user_map['Irmooc'] = "1559146239"
        user_map['elle7373'] = "1803040468"
        user_map['zssofi'] = "4567057532"
        user_map['Bourdoisea'] = "3541633980"
        self.author_product_id_map['342649'] = user_map
        self.author_product_id_map['711113'] = user_map
        self.author_product_id_map['303327'] = user_map

    def get_author_id(self, product_id, friend):
        author_map = self.author_product_id_map.get(product_id, None)
        if author_map:
            return author_map.get(friend, None)
        return None

    def get_friends_reviews(self, product_id, friends):
        friends_reviews = []
        for friend in friends:
            author_id = self.get_author_id(product_id, friend)
            if author_id:
                reviews_response = self.dev_api.get_reviews_by_author(product_id, author_id)
                if not reviews_response.get("HasErrors", True):
                    results = reviews_response.get("Results", [])
                    for result in results:
                        id = result.get("Id", None)
                        if id:
                            friends_reviews.append(id)
        return friends_reviews

    def push_friends_reviews(self, product_id, friends, reviews):
        results = reviews.get("Results", [])

        for review_id in self.get_friends_reviews(product_id, friends):
            results.insert(0, self.dev_api.get_review(review_id))

        reviews["Results"] = results
        return reviews

    def GET(self, name):
        query = web.input()
        product_id = query.get("productId", None)
        friends = query.get("friends", "")
        friends = friends.split(",")
        limit = query.get("Limit", "10")
        offset = query.get("Offset", "0")


        reviews = self.dev_api.get_reviews(product_id, limit=limit, offset=offset)

        if reviews.get("Offset") == 0:
            reviews = self.push_friends_reviews(product_id, friends, reviews)

        web.header("Access-Control-Allow-Origin", "*")
        return json.dumps(reviews)

class AuthorReviews:
    dev_api = DevApi()
    author_id = AuthorId()

    def GET(self, name):
        query = web.input()
        product_id = query.get("productId", None)
        friends = query.get("friends", "")
        friends = friends.split(",")

        reviews = {}
        for friend in friends:
            author_id = self.author_id.get_author_id(product_id, friend)
            if author_id:
                friend_review = self.dev_api.get_other_reviews_by_author(product_id, author_id)
                if len(friend_review) > 0:
                    reviews[friend] = friend_review

        web.header("Access-Control-Allow-Origin", "*")
        return json.dumps(reviews)


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()