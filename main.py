from fasthtml.common import *

app, rt = fast_app(hdrs=(picolink))

@rt("/")
def home():
    return (
        Head(
            Style(
                """
                .project-card { border: 1px solid #ddd; border-radius: 10px; margin: 30px 0; padding: 24px; background: #faf7fc; }
                .project-title { font-size: 2rem; font-weight: bold; margin-bottom: 10px; color: black;}
                .project-tech { font-size: 1rem; color: black; margin-bottom: 10px; }
                .project-desc { margin-bottom: 10px; color: black;}
                .project-media { margin-bottom: 10px; }
                .try-link { display: inline-block; margin-top: 8px; padding: 8px 16px; background: #c58ed1; color: black; border-radius: 6px; text-decoration: none; font-weight: bold; }
                """
            ),
        ),
        Socials(
            title="Just for Fun games - Jennifer",
            site_name="Vercel",
            description="Fun Games: Sand Game and Colour By Numbers made with FastHTML, Javascript, and Python",
            image="https://vercel.fyi/fasthtml-og",
            url="https://fasthtml-template.vercel.app",
            twitter_site="@vercel",
        ),


        Container(
            Titled("Just for Fun Games - Jennifer"),
            P("Welcome! Here are some of my creative coding projects. Click 'Try it' to play, or check out the code on GitHub."),
            Div(
                # Flex container for side-by-side cards
                Div(
                    Div(
                        Div(" 🏖 Dropping Sand Simulation", _class="project-title"),
                        Div("A physics-based particle simulation using velocity and gravity. Drop sand particles and watch them interact!", _class="project-desc"),
                        Div("Tech used: JavaScript, FastHTML, and Python", _class="project-tech"),
                        Div("What I learned: 2D grid simulation logic, velocity handling, edge cases, and how to create natural motion with code.", _class="project-desc"),
                        Div(
                            Img(
                                src="static/sandgamepic.png",
                                controls=True,
                                style="max-width:100%;border-radius:8px;",
                            ),
                            _class="project-media"
                        ),
                        A("Try it", href="/sandgame", _class="try-link"),
                        _class="project-card",
                        style="flex:1; min-width:320px; max-width:480px; margin-right:20px;"
                    ),
                    Div(
                        Div("🎨 Colour By Numbers", _class="project-title"),
                        Div("Upload any image and turn it into a coloring book you can paint by numbers. Palette is auto-generated from the image!", _class="project-desc"),
                        Div("Tech used: JavaScript, FastHTML, FileReader API, and Python", _class="project-tech"),
                        Div("What I learned: Image processing, palette extraction, and interactive UI design.", _class="project-desc"),
                        Div(
                            Img(
                                src="static/colourgamepic.png",
                                controls=True,
                                style="max-width:100%;border-radius:8px;",
                            ),
                            _class="project-media"
                        ),
                        A("Try it", href="/colourbynumbers", _class="try-link"),
                        _class="project-card",
                        style="flex:1; min-width:320px; max-width:480px;"
                    ),
                    style="display:flex; flex-direction:row; justify-content:center; align-items:stretch; flex-wrap:wrap;"
                ),
            )
        )
    )

@rt("/sandgame")
def sandgame():
    return (
        Head(
            Script(src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js", defer=True),
            Script(src="/static/sandgame.js", defer=True),
        ),
        Container(
            Titled("🔥 Falling Sand Simulation"),
            P("Drop sand particles with your mouse, a simple yet satisfying simulation."),
            Div(id="sand-game-container", style="margin-top: 20px;"),
            A("Back to Home", href="/", _class="try-link"),
        )
    )

@rt("/colourbynumbers")
def colourbynumbers():
    return (
        Head(
            Script(src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js", defer=True),
            Script(src="/static/colourbynumbers.js", defer=True),
        ),
        Container(
            Titled("🎨 Colour By Numbers"),
            P("Upload a file and start coloring by numbers!"),
            Div(id="color-game-container", style="margin-top: 20px;"),
            A("Back to Home", href="/", _class="try-link"),
        )
    )

serve()