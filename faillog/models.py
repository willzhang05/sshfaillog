from sqlalchemy import Column, Integer, String
from sqlalchemy_utils import IPAddressType, JSONType
from faillog.database import Base

class Address(Base):
    __tablename__ = 'addresses'
    id = Column(Integer, primary_key=True)
    ip = Column(IPAddressType)
    data = Column(JSONType)

    def __init__(self, ip, data):
        self.ip = ip
        self.data = data

    def __repr__(self):
        return str(self.ip) + str(self.data)
