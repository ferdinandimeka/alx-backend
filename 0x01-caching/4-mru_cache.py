#!/usr/bin/python3
''' MRU Caching
'''


from collections import deque


BaseCaching = __import__('base_caching').BaseCaching


class MRUCache(BaseCaching):
    ''' MRUcache class
    '''

    def __init__(self):
        ''' Init
        '''
        super().__init__()
        self.queue = deque()

    def put(self, key, item):
        ''' Add an item in the cache
        '''
        if key and item is not None:
            if key not in self.cache_data:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    discard = self.queue.pop()
                    del self.cache_data[discard]
                    print('DISCARD: {}'.format(discard))
                self.queue.append(key)
            else:
                self.queue.remove(key)
                self.queue.append(key)
            self.cache_data[key] = item

    def get(self, key):
        ''' Get an item by key
        '''
        if key is not None and key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            return self.cache_data[key]
        return None
