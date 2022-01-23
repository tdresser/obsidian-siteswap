## Obsidian Siteswap

This plugin renders the "[Siteswap](https://en.wikipedia.org/wiki/Siteswap)" juggling notation via the Juggling Lab GIF server. Full documentation for the GIF server is [here](https://jugglinglab.org/html/animinfo.html).

This plugin requires an internet connection.

Straight forward siteswaps can be visualized via:

<pre>
```siteswap
(4x,2)*
```
</pre>

![](<https://jugglinglab.org/anim?redirect=true;height=200;width=200;pattern=(4%2C2x)*>)

If you want to specify more details than just the pattern, use the following form:

<pre>
```siteswap
pattern: 3
hands: (-25)(2.5).(25)(-2.5).(-25)(0).
colors: mixed
```
</pre>

![](<https://jugglinglab.org/anim?redirect=true;pattern=3;height=200;width=200;hands=(-25)(2.5).(25)(-2.5).(-25)(0).;colors=mixed>)

Details are specified via YAML - each line contains the name of a key, followed by a colon and a space, followed by a value.

Some attributes can be defined globally via the plugin settings. If global settings conflict with the details specified for a given animation, the global attributes are overwritten.

## Per Animation Settings

-   pattern: siteswap pattern to animate, in generalized siteswap notation.
-   bps: number of beats per second in the pattern, a floating point value. Default is automatically calculated from the pattern.
-   dwell: number of beats a catch is made prior to the subsequent throw. Values are floating-point numbers between 0.0 and 2.0; default value is 1.3.
-   hands: one of 'mills', 'inside', 'outside', 'half' or hand movement as a sequence of spatial coordinates for catches and throws and points in-between. Details [here](https://jugglinglab.org/html/sspanel.html).
-   body: body movement as a sequence of angles and spatial coordinates. Details [here](https://jugglinglab.org/html/sspanel.html).
-   colors: determines the coloring of the props. Each color is defined either by name or by its red/green/blue components on a 0-255 scale. For example if this setting is equal to {red} or {255,0,0}, the animator will use red balls. If you define several colors in a list, they are assigned to the balls in a cyclical manner. For example, {255,0,0}{0,255,0} means that ball 1 is red, ball 2 is green, ball 3 is red, ball 4 is green, and so on. Recognized color names are: black, blue, cyan, gray, green, magenta, orange, pink, red, yellow. Using the value mixed (no braces) will apply a pre-defined mix of colors. Default is {red}.
-   propdiam: diameter of the props, in centimeters. Default is 10.0.
-   prop: prop type to use. Recognized prop names are ball, image, and ring; default is ball.
-   gravity: acceleration of gravity, in cm/sec^2. Default is 980.0 (Earth standard).
-   bouncefrac: fraction of a ball's energy retained after bouncing off the ground (how much of its dropped height does it return to?). Values are floating point numbers greater than 0.0; default is 0.9.
-   hss: hand siteswap pattern to apply to the hands. See the [documentation](https://jugglinglab.org/html/HandSiteswapFeature.pdf).
-   handspec: (for hss mode only) assignment of hands to jugglers; see [documentation](https://jugglinglab.org/html/HandSiteswapFeature.pdf) for format.
-   dwellmax: (for hss mode only) whether to automatically maximize dwell time. Default value is true.
-   hold: (for hss mode only) whether to hold throws that can be held. Default value is false.

## Global Settings

-   width: Width of the animation, in pixels.
-   height: Height of the animation, in pixels.
-   scale: Scaling factor for the generated GIF. 1.0 performs no scaling.
-   fps: Number of frames per second in the generated GIF.
-   slowdown: Defines an overall time slowdown factor (e.g., slowdown: 1.0 is actual speed, slowdown: 2.0 is half actual speed).
-   showground: Whether to display the ground ("true", "false" or "auto").
-   camangle: Camera angles in degrees, given as one or a pair of angles. Example: camangle: (0,90). The first angle describes rotation of the camera around the juggler, and the second angle is the elevation angle given as degrees from directly overhead (i.e., 90 puts the camera on the same level as the juggler). Default value depends on the pattern.
-   hidejugglers: List of one or more jugglers to hide (i.e., not render) during animation. Examples: hidejugglers=1 or hidejugglers=(1,3).
-   stereo: Whether to display the pattern as a cross-eyed stereogram.
