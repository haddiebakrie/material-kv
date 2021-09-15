import os
from inspect import getsourcefile
import sys

allf = []
sourcedir = os.path.abspath(os.path.dirname(sys.argv[0]))

for svgfile in os.listdir(sourcedir):
    svg =  open(sourcedir + '\\' +svgfile, 'r')
    filedata = svg.read()
    svg.close()

    print(filedata)

    nfiledata = filedata.replace('width=\"24\"', '')
    ffiledata = nfiledata.replace('height=\"24\"', '')
        
    svg = open(sourcedir + '\\' +svgfile, 'w')
    svg.write(ffiledata)
    svg.close()