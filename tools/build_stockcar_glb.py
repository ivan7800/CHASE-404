"""Build a deterministic, offline stock-car GLB preview mesh (requires trimesh + numpy).
The editable Blender script in blender/ can export its own replacement to the same path.
Coordinates are X right / Y up / +Z nose, matching the game renderer.
"""
from pathlib import Path
import numpy as np
import trimesh

s = trimesh.Scene()
part = 0
PAINT=(226,48,61,255); PAINT_DARK=(147,28,46,255); PEARL=(245,240,221,255); GLASS=(46,115,150,255)
BLACK=(24,35,48,255); CHROME=(143,161,166,255); GOLD=(250,186,72,255); SEAM=(57,72,82,255)

def add_mesh(label, m, color):
    global part
    m.visual.vertex_colors=np.tile(np.array(color,dtype=np.uint8),(len(m.vertices),1))
    s.add_geometry(m,geom_name=f'{label}_{part:03d}',node_name=f'{label}_{part:03d}')
    part+=1

def box(label, center, size, col):
    m=trimesh.creation.box(extents=size)
    m.apply_translation(center)
    add_mesh(label,m,col)

def taper(label, z, lower_y,upper_y, bottom_width,bottom_len,top_width,top_len,col):
    verts=[]
    for y,w,l in ((lower_y,bottom_width,bottom_len),(upper_y,top_width,top_len)):
        verts += [[-w/2,y,z-l/2],[w/2,y,z-l/2],[w/2,y,z+l/2],[-w/2,y,z+l/2]]
    tris=[]
    for quad in ((3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)):
        for a,b,c in ((0,1,2),(0,2,3)):tris.append([quad[a],quad[b],quad[c]])
    add_mesh(label,trimesh.Trimesh(vertices=verts,faces=tris,process=False),col)

def decal(label, points, color):
    add_mesh(label,trimesh.Trimesh(vertices=points,faces=[[0,1,2],[0,2,3]],process=False),color)

# Sculpted stock car shell with tapered top and bumper lines.
taper('aero_floor',0,.37,.65,3.20,7.92,3.2,7.74,BLACK)
taper('red_body',0,.62,1.34,3.41,7.68,3.15,7.37,PAINT)
taper('hood',2.42,1.31,1.49,3.13,2.73,3.06,2.65,PAINT)
taper('rear_deck',-2.9,1.27,1.43,3.12,1.62,3.02,1.57,PAINT)
taper('roof',-.48,1.36,2.48,2.79,3.9,2.25,2.33,PAINT_DARK)
# Insets and windows, set slightly above the roof surface.
decal('front_windshield',[[-1.09,2.497,.63],[1.09,2.497,.63],[1.38,1.46,1.35],[-1.38,1.46,1.35]],GLASS)
decal('rear_windshield',[[1.10,2.497,-1.59],[-1.10,2.497,-1.59],[-1.38,1.46,-2.45],[1.38,1.46,-2.45]],GLASS)
for side in (-1,1):
    decal('side_window',[[side*1.155,2.46,-1.48],[side*1.155,2.46,.46],[side*1.408,1.51,1.11],[side*1.408,1.51,-2.27]],GLASS)
    # Twin stripes above the front hood and roof.
    box('hood_stripe',(side*.63,1.512,2.56),(.35,.033,2.05),PEARL)
    box('roof_stripe',(side*.56,2.50,-.44),(.30,.025,1.67),PEARL)
    box('side_skirt',(side*1.68,.64,.0),(.08,.19,5.65),BLACK)
    box('front_headlamp',(side*1.17,.99,3.77),(.82,.36,.095),GOLD)
    box('taillight',(side*1.15,.98,-3.83),(.81,.25,.09),PAINT_DARK)
    box('door_handle',(side*1.63,1.4,-.51),(.06,.055,.38),CHROME)
    box('mirror_stalk',(side*1.65,1.66,.80),(.10,.25,.10),CHROME)
    box('wing_mirror',(side*1.75,1.78,.82),(.31,.18,.45),BLACK)
    box('wheelarch_front',(side*1.60,.95,2.35),(.11,.10,1.8),SEAM)
    box('wheelarch_rear',(side*1.60,.95,-2.37),(.11,.10,1.8),SEAM)
    # Door number graphic assembled as chunky rectangular linework on both sides.
    x=side*1.707
    def bar(y,z,dy,dz):box('number04',(x,y,z),(.055,dy,dz),PEARL)
    bar(1.04,.52,.49,.11);bar(1.04,-.06,.49,.11)
    bar(1.26,.23,.08,.50);bar(.80,.23,.07,.50)
    bar(1.04,-.58,.51,.1);bar(1.27,-.37,.09,.40);bar(.80,-.78,.08,.40)
# Racing appointments and trim.
box('front_bumper',(0,.62,3.84),(3.29,.42,.26),BLACK)
box('front_grill',(0,.97,3.875),(1.44,.28,.08),SEAM)
box('front_splitter',(0,.40,3.95),(3.50,.075,.45),BLACK)
box('rear_bumper',(0,.71,-3.88),(3.26,.42,.26),BLACK)
box('spoiler_blade',(0,1.82,-3.72),(3.64,.16,.72),BLACK)
for side in (-1,1):
    box('spoiler_stem',(side*1.20,1.51,-3.61),(.18,.54,.17),CHROME)
box('rear_number_board',(0,1.04,-3.91),(1.06,.26,.05),PEARL)
box('roof_vent',(0,2.525,-1.2),(.61,.06,.32),BLACK)

path=Path(__file__).resolve().parents[1]/'assets'/'models'/'racer-04.glb'
path.parent.mkdir(parents=True,exist_ok=True)
path.write_bytes(s.export(file_type='glb'))
print('Created',path,'parts',part,'size',path.stat().st_size)
