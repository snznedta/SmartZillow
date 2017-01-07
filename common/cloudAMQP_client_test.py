from cloudAMQP_client import CloudAMQP

CLOUDAMQP_URL = 'amqp://qmvljrwj:1IDFZsc2wJSX74wZhjBOmSsfBMCb5g_E@wombat.rmq.cloudamqp.com/qmvljrwj'
QUEUE_NAME = 'test_queue'

#instantiate client
client = CloudAMQP(CLOUDAMQP_URL, QUEUE_NAME)

#Send a message
 
#client.sendDataFetcherTask({'name' : 'test message'})

#Get a message

client.getDataFetcherTask()