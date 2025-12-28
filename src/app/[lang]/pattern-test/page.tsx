'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatternTestPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-main">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Prueba de Patrones Decorativos
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Revisa los patrones antes de aplicarlos. Opacidades muy sutiles (2-5%)
        </p>

        {/* Dot Patterns */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">1. Patrones de Puntos (Dots)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="h-48 pattern-dots-sparse border-b" />
              <CardHeader>
                <CardTitle>Dots Sparse</CardTitle>
                <p className="text-sm text-muted-foreground">
                  40px spacing, 0.03 opacity, 1.5px dots
                </p>
                <code className="text-xs bg-muted p-2 rounded block mt-2">
                  .pattern-dots-sparse
                </code>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 pattern-dots-normal border-b" />
              <CardHeader>
                <CardTitle>Dots Normal</CardTitle>
                <p className="text-sm text-muted-foreground">
                  24px spacing, 0.04 opacity, 1.5px dots
                </p>
                <code className="text-xs bg-muted p-2 rounded block mt-2">
                  .pattern-dots-normal
                </code>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 pattern-dots-dense border-b" />
              <CardHeader>
                <CardTitle>Dots Dense</CardTitle>
                <p className="text-sm text-muted-foreground">
                  16px spacing, 0.05 opacity, 1px dots
                </p>
                <code className="text-xs bg-muted p-2 rounded block mt-2">
                  .pattern-dots-dense
                </code>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Diagonal Patterns */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">2. Patrones Diagonales (45deg)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-48 pattern-diagonal border-b" />
              <CardHeader>
                <CardTitle>Diagonal 45deg</CardTitle>
                <p className="text-sm text-muted-foreground">
                  30px spacing, 0.02 opacity, primary color
                </p>
                <code className="text-xs bg-muted p-2 rounded block mt-2">
                  .pattern-diagonal
                </code>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 pattern-diagonal-reverse border-b" />
              <CardHeader>
                <CardTitle>Diagonal -45deg</CardTitle>
                <p className="text-sm text-muted-foreground">
                  30px spacing, 0.02 opacity, accent color
                </p>
                <code className="text-xs bg-muted p-2 rounded block mt-2">
                  .pattern-diagonal-reverse
                </code>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Grid Pattern */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">3. Patrón de Líneas Grid</h2>
          <Card className="overflow-hidden">
            <div className="h-48 pattern-lines-grid border-b" />
            <CardHeader>
              <CardTitle>Lines Grid</CardTitle>
              <p className="text-sm text-muted-foreground">
                30px x 30px grid, 0.03 opacity, 1px lines
              </p>
              <code className="text-xs bg-muted p-2 rounded block mt-2">
                .pattern-lines-grid
              </code>
            </CardHeader>
          </Card>
        </section>

        {/* Bracket Corners */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">4. Bracket Corners [ ]</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bracket-corners border-2">
              <CardHeader>
                <CardTitle>Normal State</CardTitle>
                <CardContent className="p-0 mt-4">
                  <p className="text-sm text-muted-foreground">
                    20px brackets, 0.3 opacity
                  </p>
                  <code className="text-xs bg-muted p-2 rounded block mt-2">
                    .bracket-corners
                  </code>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="bracket-corners border-2 hover:border-primary/50">
              <CardHeader>
                <CardTitle>Hover Me</CardTitle>
                <CardContent className="p-0 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Expande a 24px, 0.6 opacity
                  </p>
                  <code className="text-xs bg-muted p-2 rounded block mt-2">
                    :hover
                  </code>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="bracket-corners border-2 bg-muted/50">
              <CardHeader>
                <CardTitle>Con Background</CardTitle>
                <CardContent className="p-0 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Se ve bien con fondos
                  </p>
                  <code className="text-xs bg-muted p-2 rounded block mt-2">
                    .bg-muted/50
                  </code>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Combined Patterns */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">5. Combinaciones (Card con Pattern + Bracket)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bracket-corners border-2 overflow-hidden">
              <div className="p-6 pattern-dots-sparse">
                <h3 className="text-xl font-bold mb-2">Dots + Brackets</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Patrón sparse de fondo con bracket corners
                </p>
                <Button size="sm">Ver más</Button>
              </div>
            </Card>

            <Card className="bracket-corners border-2 overflow-hidden">
              <div className="p-6 pattern-diagonal">
                <h3 className="text-xl font-bold mb-2">Diagonal + Brackets</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Patrón diagonal de fondo con bracket corners
                </p>
                <Button size="sm">Ver más</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Dotted Border */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">6. Bordes Dotted</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-dotted-primary bg-card">
              <p className="font-semibold">Border Left Dotted</p>
              <p className="text-sm text-muted-foreground">Para FAQ, Accordions, Lists</p>
            </div>
            <div className="p-4 border-2 border-dotted-primary bg-card rounded">
              <p className="font-semibold">Border All Dotted</p>
              <p className="text-sm text-muted-foreground">Borde completo dotted</p>
            </div>
          </div>
        </section>

        {/* Uso Recomendado */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">7. Guía de Uso Recomendado</h2>
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Consistencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <p><strong>Cards de servicio/proyecto:</strong> bracket-corners</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <p><strong>Backgrounds decorativos:</strong> pattern-diagonal o pattern-diagonal-reverse</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <p><strong>Áreas de texto/contenido:</strong> pattern-dots-sparse o pattern-dots-normal</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <p><strong>Elementos de lista (FAQ, accordion):</strong> border-dotted-primary</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <p><strong>NUNCA:</strong> combinar dots + diagonal en la misma área directa</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <p><strong>NUNCA:</strong> opacidad superior a 5% en backgrounds</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Esta página es temporal. Revisa los patrones y cuando estés satisfecho, procederemos a aplicarlos.
          </p>
          <p className="text-sm text-muted-foreground">
            Tip: Prueba en modo dark/light para ver cómo se adaptan los patrones
          </p>
        </div>
      </div>
    </div>
  );
}
