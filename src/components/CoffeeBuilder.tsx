"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CoffeeBuilder.module.css";

type Ingredient = "coffee" | "water" | "milk" | "foam" | "syrup";
type Pour = { id: number; ingredient: Ingredient };

type IngredientMeta = {
  id: Ingredient;
  label: string;
  asset: string;
  hint: string;
};

type RecipePreset = {
  id: string;
  title: string;
  short: string;
  layers: Ingredient[];
  description: string;
};

const MAX_LAYERS = 6;
const STEP_MS = 650;

const ingredients: IngredientMeta[] = [
  { id: "coffee", label: "Эспрессо", asset: "/ingredients/espresso.png", hint: "крепкая база" },
  { id: "water", label: "Вода", asset: "/ingredients/water.png", hint: "для американо" },
  { id: "milk", label: "Молоко", asset: "/ingredients/milk.png", hint: "смягчает вкус" },
  { id: "foam", label: "Пенка", asset: "/ingredients/foam.png", hint: "воздушный верх" },
  { id: "syrup", label: "Сироп", asset: "/ingredients/syrup.png", hint: "сладкий акцент" },
];

const presets: RecipePreset[] = [
  { id: "espresso", title: "Эспрессо", short: "1 шот", layers: ["coffee"], description: "Короткий, плотный и самый базовый кофе." },
  { id: "doppio", title: "Доппио", short: "2 шота", layers: ["coffee", "coffee"], description: "Двойной эспрессо — больше интенсивности." },
  { id: "americano", title: "Американо", short: "эспрессо + вода", layers: ["coffee", "water"], description: "Эспрессо, разбавленный горячей водой." },
  { id: "long-black", title: "Long black", short: "вода + эспрессо", layers: ["water", "coffee", "coffee"], description: "Сначала вода, затем шоты эспрессо сверху." },
  { id: "macchiato", title: "Эспрессо макиато", short: "эспрессо + пенка", layers: ["coffee", "foam"], description: "Эспрессо, отмеченный молочной пенкой." },
  { id: "cortado", title: "Кортадо", short: "эспрессо + молоко", layers: ["coffee", "milk"], description: "Ровнее и мягче, чем чистый эспрессо." },
  { id: "cappuccino", title: "Капучино", short: "эспрессо + молоко + пенка", layers: ["coffee", "milk", "foam"], description: "Классика с заметной воздушной пенкой." },
  { id: "latte", title: "Латте", short: "эспрессо + 2×молоко + пенка", layers: ["coffee", "milk", "milk", "foam"], description: "Самый мягкий и молочный из классики." },
  { id: "flat-white", title: "Flat white", short: "2×эспрессо + молоко", layers: ["coffee", "coffee", "milk"], description: "Яркий кофейный вкус и мягкое молоко." },
  { id: "vanilla-latte", title: "Ванильный латте", short: "латте + сироп", layers: ["coffee", "milk", "milk", "foam", "syrup"], description: "Классический латте с ванильной сладостью." },
];

function count(layers: Ingredient[]) {
  return {
    coffee: layers.filter((item) => item === "coffee").length,
    water: layers.filter((item) => item === "water").length,
    milk: layers.filter((item) => item === "milk").length,
    foam: layers.filter((item) => item === "foam").length,
    syrup: layers.filter((item) => item === "syrup").length,
    total: layers.length,
  };
}

function samePattern(layers: Ingredient[], pattern: Ingredient[]) {
  return layers.length === pattern.length && layers.every((item, index) => item === pattern[index]);
}

function withoutSyrup(layers: Ingredient[]) {
  return layers.filter((item) => item !== "syrup");
}

function hasSyrup(layers: Ingredient[]) {
  return layers.includes("syrup");
}

function identify(layers: Ingredient[]) {
  const clean = withoutSyrup(layers);
  const sweet = hasSyrup(layers);
  const stats = count(layers);

  if (!stats.total) {
    return {
      name: "Соберите свой напиток",
      description: "Выбирайте ингредиенты или нажмите на готовый рецепт ниже — напиток соберётся сам.",
    };
  }

  if (!stats.coffee) {
    return {
      name: "Нужна кофейная база",
      description: "Начните с эспрессо, чтобы получить именно кофейный напиток.",
    };
  }

  if (samePattern(clean, ["coffee"])) {
    return { name: sweet ? "Эспрессо с сиропом" : "Эспрессо", description: sweet ? "Короткий эспрессо со сладким акцентом." : "Концентрированный чёрный кофе с плотной крема." };
  }
  if (samePattern(clean, ["coffee", "coffee"])) {
    return { name: sweet ? "Сладкий доппио" : "Доппио", description: sweet ? "Двойной эспрессо с сиропом." : "Двойной шот эспрессо — больше плотности и бодрости." };
  }
  if (samePattern(clean, ["coffee", "water"])) {
    return { name: sweet ? "Ванильный американо" : "Американо", description: sweet ? "Эспрессо, вода и мягкая сладость сиропа." : "Эспрессо, разбавленный горячей водой." };
  }
  if (samePattern(clean, ["water", "coffee"]) || samePattern(clean, ["water", "coffee", "coffee"])) {
    return { name: sweet ? "Сладкий long black" : "Long black", description: sweet ? "Более насыщенный long black с сиропом." : "Сначала вода, затем эспрессо — ярче ощущается кофе." };
  }
  if (samePattern(clean, ["coffee", "foam"])) {
    return { name: sweet ? "Сладкий макиато" : "Эспрессо макиато", description: sweet ? "Эспрессо, пенка и сироп." : "Эспрессо с небольшим количеством молочной пенки." };
  }
  if (samePattern(clean, ["coffee", "milk"])) {
    return { name: sweet ? "Ванильный кортадо" : "Кортадо", description: sweet ? "Кортадо с мягкой сладкой нотой." : "Эспрессо с небольшим количеством молока." };
  }
  if (samePattern(clean, ["coffee", "milk", "foam"])) {
    return { name: sweet ? "Ванильный капучино" : "Капучино", description: sweet ? "Капучино с сиропом и более десертным характером." : "Эспрессо, молоко и плотная воздушная пенка." };
  }
  if (samePattern(clean, ["coffee", "milk", "milk"]) || samePattern(clean, ["coffee", "milk", "milk", "foam"])) {
    return { name: sweet ? "Ванильный латте" : "Латте", description: sweet ? "Мягкий латте с ванильным акцентом." : "Много молока, мягкий вкус кофе и нежная текстура." };
  }
  if (samePattern(clean, ["coffee", "coffee", "milk"]) || samePattern(clean, ["coffee", "coffee", "milk", "foam"])) {
    return { name: sweet ? "Ванильный flat white" : "Flat white", description: sweet ? "Flat white с лёгкой сладкой нотой сиропа." : "Более кофейный, чем латте, но всё ещё мягкий по текстуре." };
  }

  if (stats.coffee >= 1 && stats.milk >= 1 && stats.foam >= 1) {
    return { name: sweet ? "Молочный кофе с сиропом" : "Молочный кофе", description: sweet ? "Похоже на авторскую сладкую вариацию молочного кофейного напитка." : "Комбинация кофе, молока и пенки вне строгого классического шаблона." };
  }

  if (stats.coffee >= 1 && stats.water >= 1) {
    return { name: sweet ? "Авторский американо" : "Чёрный кофе на основе эспрессо", description: sweet ? "Вода, кофе и сироп — не канон, но вполне жизнеспособно." : "Похоже на вариацию американо или long black." };
  }

  return { name: "Авторский микс", description: "Не самый классический рецепт, но он всё ещё выглядит как кофе с характером." };
}

function compositionLabel(layers: Ingredient[]) {
  const { coffee, water, milk, foam, syrup } = count(layers);
  const parts = [
    coffee ? `эспрессо ×${coffee}` : null,
    water ? `вода ×${water}` : null,
    milk ? `молоко ×${milk}` : null,
    foam ? `пенка ×${foam}` : null,
    syrup ? `сироп ×${syrup}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Пока стакан пуст";
}

export default function CoffeeBuilder() {
  const [layers, setLayers] = useState<Ingredient[]>([]);
  const [pour, setPour] = useState<Pour | null>(null);
  const [notice, setNotice] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState("cappuccino");
  const [autofilling, setAutofilling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queuedTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const counter = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = media.matches;
    };
    update();
    media.addEventListener?.("change", update);
    return () => {
      media.removeEventListener?.("change", update);
      if (timer.current) clearTimeout(timer.current);
      queuedTimers.current.forEach(clearTimeout);
    };
  }, []);

  const busy = pour !== null || autofilling;
  const full = layers.length >= MAX_LAYERS;
  const drink = useMemo(() => identify(layers), [layers]);
  const composition = useMemo(() => compositionLabel(layers), [layers]);

  function clearAllTimers() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    queuedTimers.current.forEach(clearTimeout);
    queuedTimers.current = [];
  }

  function add(ingredient: Ingredient) {
    if (busy || full) return;
    setNotice("");
    setActivePreset(null);

    if (reducedMotion.current) {
      setLayers((items) => [...items, ingredient]);
      return;
    }

    const id = ++counter.current;
    setPour({ id, ingredient });
    timer.current = setTimeout(() => {
      setLayers((items) => [...items, ingredient]);
      setPour(null);
      timer.current = null;
    }, STEP_MS);
  }

  function buildPreset(preset: RecipePreset) {
    clearAllTimers();
    const pattern = preset.layers.slice(0, MAX_LAYERS);
    setActivePreset(preset.id);
    setNotice(`Собираем: ${preset.title}.`);
    setLayers([]);
    setPour(null);

    if (reducedMotion.current) {
      setLayers(pattern);
      setNotice(`Готово: ${preset.title}.`);
      return;
    }

    setAutofilling(true);

    pattern.forEach((ingredient, index) => {
      const showTimer = setTimeout(() => {
        const id = ++counter.current;
        setPour({ id, ingredient });
      }, index * STEP_MS);

      const commitTimer = setTimeout(() => {
        setLayers((items) => [...items, ingredient]);
        setPour(null);

        if (index === pattern.length - 1) {
          setAutofilling(false);
          setNotice(`Готово: ${preset.title}.`);
        }
      }, index * STEP_MS + Math.round(STEP_MS * 0.8));

      queuedTimers.current.push(showTimer, commitTimer);
    });
  }

  function reset() {
    clearAllTimers();
    setPour(null);
    setLayers([]);
    setAutofilling(false);
    setActivePreset(null);
    setNotice("Можно собрать новый рецепт.");
  }

  return (
    <div className={styles.builder} aria-label="Интерактивный конструктор кофейного напитка">
      <div className={styles.topline}>
        <span>ИНТЕРАКТИВНЫЙ КОФЕ-БЛОК</span>
        <span>КЛАССИЧЕСКИЕ РЕЦЕПТЫ</span>
      </div>

      <div className={styles.heading} aria-live="polite" aria-atomic="true">
        <span className={styles.eyebrow}>КОНСТРУКТОР НАПИТКА</span>
        <h2>{drink.name}</h2>
        <p>{drink.description}</p>
        <div className={styles.composition}>{composition}</div>
      </div>

      <div className={styles.scene}>
        <div className={styles.ingredients} aria-label="Ингредиенты">
          {ingredients.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.ingredient} ${styles[item.id]}`}
              disabled={busy || full}
              onClick={() => add(item.id)}
              aria-label={`Добавить ингредиент: ${item.label}`}
            >
              <span className={styles.illustration} aria-hidden="true">
                <Image src={item.asset} alt="" fill sizes="80px" className={styles.illustrationImage} />
              </span>
              <span className={styles.ingredientLabel}>{item.label}</span>
              <span className={styles.ingredientHint}>{item.hint}</span>
            </button>
          ))}
        </div>

        <div className={styles.cupArea}>
          {pour && <div key={pour.id} className={`${styles.stream} ${styles[`stream_${pour.ingredient}`]}`} aria-hidden="true" />}
          <div className={styles.cupGlow} aria-hidden="true" />
          <div className={styles.cup} role="img" aria-label={`Прозрачный стакан: слоёв ${layers.length} из ${MAX_LAYERS}`}>
            <div className={styles.liquids}>
              {layers.map((layer, index) => {
                const isTop = index === layers.length - 1;
                return (
                  <div
                    key={`${layer}-${index}`}
                    className={`${styles.layer} ${styles[`layer_${layer}`]} ${isTop ? styles.topLayer : ""}`}
                    style={{ bottom: `${index * (100 / MAX_LAYERS)}%`, height: `${100 / MAX_LAYERS + 0.45}%` }}
                  />
                );
              })}
            </div>
            <div className={styles.rim} />
            <div className={styles.reflection} />
          </div>
          <div className={styles.saucer} />
          <span className={styles.cupLabel}>Нажимайте на ингредиенты или выберите готовый рецепт</span>
        </div>
      </div>

      <div className={styles.bottomline}>
        <div className={styles.meter}>
          <span>СЛОИ {layers.length} / {MAX_LAYERS}</span>
          <div className={styles.meterDots}>
            {Array.from({ length: MAX_LAYERS }, (_, index) => (
              <i key={index} className={index < layers.length ? styles.active : ""} />
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <span role="status">{full ? "Стакан заполнен. Начните заново." : busy ? "Готовим напиток…" : notice || "Можно собирать вручную или запускать готовые рецепты."}</span>
          <button type="button" onClick={reset} disabled={!layers.length && !busy}>
            ↺ Сбросить
          </button>
        </div>
      </div>

      <div className={styles.recipeHints}>
        <label htmlFor="quick-coffee-recipe" className={styles.recipeLabel}>БЫСТРЫЙ РЕЦЕПТ</label>
        <div className={styles.recipeControls}>
          <select
            id="quick-coffee-recipe"
            className={styles.recipeSelect}
            value={selectedRecipe}
            onChange={(event) => setSelectedRecipe(event.target.value)}
            disabled={busy}
          >
            {presets.map((preset) => (
              <option value={preset.id} key={preset.id}>{preset.title} — {preset.short}</option>
            ))}
          </select>
          <button
            type="button"
            className={styles.recipeBuild}
            disabled={busy}
            onClick={() => {
              const preset = presets.find((item) => item.id === selectedRecipe);
              if (preset) buildPreset(preset);
            }}
          >
            Собрать <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className={styles.recipeHelp}>Выберите напиток — ингредиенты добавятся автоматически.</p>
      </div>
    </div>
  );
}
