from setuptools import setup
import os

setup(
    name='faillog',
    packages=['faillog'],
    include_package_data=True,
    install_requires=[
        'flask',
    ],
)

open('faillog/faillog.db', 'a').close()
